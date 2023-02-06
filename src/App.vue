<template>
  <main v-if="hasPermission">
    <h1>Remind Me Mom</h1>

    <Settings v-if="!isTrackingStarted" @track-data="trackData" />

    <div v-if="isTrackingStarted">
      <h1>Tracking Started</h1>

      <button @click="stopTracking">Stop Tracking</button>
    </div>
  </main>

  <div v-else>
    <h1>Permission not granted</h1>
    <p>
      Please allow location permission and notification permission to use this
      app. If you have already granted permission, please refresh the page.
    </p>

    <p>
      If you have prompted for permission and denied, please allow permission
      manually from the browser.
    </p>

    <p>
      If you are using Chrome/Chromium, please follow the below links to allow
      permission. If you are using any other browser, please follow the browser
      documentation.
    </p>

    <p>
      <a
        href="https://support.google.com/chrome/answer/142065?co=GENIE.Platform%3DDesktop&hl=en"
        target="_blank"
      >
        How to allow location permission in Chrome
      </a>
      <br />
      <a
        href="https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop&hl=en"
        target="_blank"
      >
        How to allow notification permission in Chrome
      </a>
    </p>

    <h3>Thank you!</h3>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Settings from "./components/Settings.vue";
import { calculateDistance } from "./helpers/calcDistance";

const isTrackingStarted = ref(false);
const hasPermission = ref(false);

const SETTINGS_KEY = "rmm_settings";

const settings = ref<{
  distance: number;
  intervalTime: number;
  location: {
    lat: number;
    long: number;
  };
}>();

const interval = ref<any>();

const trackData = (event: any) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };

      const data = { ...event, location };

      settings.value = data;

      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
      startTracking();
    });
  }
};

const isFarFromDistance = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { distance, location } = settings.value!;

      const currentLocation = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };

      // For testing
      // currentLocation.lat = 23.772016493428918;
      // currentLocation.long = 90.39357741923828;

      const currentDistance = calculateDistance(location, currentLocation);

      console.log("Current Distance: ", currentDistance);

      if (currentDistance > distance) {
        console.log("You are far from the stored location.");
        new Notification("You are far from the stored location.");
      } else {
        console.log("You are close to the stored location.");
        // new Notification("You are close to the stored location.");
      }
    });
  }
};

const startTracking = () => {
  isTrackingStarted.value = true;
  interval.value = setInterval(() => {
    isFarFromDistance();
  }, settings.value!.intervalTime * 1000);
};

const stopTracking = () => {
  localStorage.removeItem(SETTINGS_KEY);
  if (interval.value) {
    clearInterval(interval.value);
  }
  isTrackingStarted.value = false;
  settings.value = undefined;
};

// request for permission
const requestPermission = () => {
  if (navigator.permissions) {
    return new Promise((resolve) => {
      Promise.all([
        navigator.permissions.query({ name: "geolocation" }),
        Notification.requestPermission(),
      ]).then(([locationPermission, notificationPermission]) => {
        if (
          locationPermission.state === "granted" &&
          notificationPermission === "granted"
        ) {
          console.log("Permission granted");
          resolve(true);
        } else {
          console.log("Permission denied");
          resolve(false);
        }
      });
    });
  } else {
    console.log("Permission API not supported");
    return new Promise((resolve) => {
      resolve(true);
    });
  }
};

onMounted(() => {
  requestPermission().then((isGranted) => {
    console.log("Permission granted: ", isGranted);
    if (isGranted) {
      hasPermission.value = true;
      const prevSettings = localStorage.getItem(SETTINGS_KEY);
      if (prevSettings) {
        settings.value = JSON.parse(prevSettings);
        startTracking();
      }
    } else {
      hasPermission.value = false;
    }
  });
});
</script>
