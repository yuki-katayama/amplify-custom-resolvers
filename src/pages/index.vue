
<template>
	<div v-if="user">
		<Home />
	</div>
	<div v-else>
		<h1>ログインしてください。</h1>
		<authenticator>
			<template v-slot="{ user, signOut }">
				<h1>Hello {{ user.username }}!</h1>
				<button @click="signOut">Sign Out</button>
			</template>
		</authenticator>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import * as myModels from "@/models/models";
import Home from "@/pages/home"

const auth = useAuthenticator();
const user = ref<myModels.User>(auth.user); // リアクティブな参照としてユーザー情報を保持

// auth.userの変更を監視
watch(() => auth.user, (newUser: myModels.User) => {
  console.log("Authenticated user:", newUser);
  user.value = newUser; // ユーザー情報の更新
}); // コンポーネントマウント時に即座に実行

</script>