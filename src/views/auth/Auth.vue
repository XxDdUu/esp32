<script setup lang="ts">
import { loginWithGoogle } from "@/firebase/auth";
import InputField from "@/components/ui/InputField.vue";
import { ref } from "vue";

const email = ref("");

const handleGoogleLogin = async () => {
  try {
    const user = await loginWithGoogle();
    console.log("User:", user);
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div class="container">
    <h2 class="text-2xl font-bold text-center">Login</h2>

    <!-- EMAIL LOGIN (optional) -->
    <InputField v-model="email" label="Email" />

    <button class="login-btn">Continue</button>

    <div class="divider">OR</div>

    <!-- GOOGLE BUTTON -->
    <button class="google-btn" @click="handleGoogleLogin">
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
      />
      Continue with Google
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 300px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-btn {
  background: #2563eb;
  color: white;
  padding: 10px;
  border-radius: 8px;
}

.divider {
  text-align: center;
  color: gray;
}

.google-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.google-btn img {
  width: 20px;
}
</style>
