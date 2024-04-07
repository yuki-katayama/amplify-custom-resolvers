<template>
	<div class="chat-container">
	  <div class="messages" v-if="messages.length > 0">
		<div v-for="message in messages" :key="message.id" class="message" :class="message.name === user.signInDetails.loginId ? 'self' : 'other'">
			<!-- {{ message }}{{user}} -->
			<p>{{ message.name }}</p>
			<p>{{ message.content }}</p>
			<span class="timestamp">{{ message.createdAt }}</span>
		</div>
	  </div>
	  <div class="input-area">
		<textarea v-model="inputContent" placeholder="Type a message"></textarea>

		<button @click="onSendMessage">Send</button>
		<button @click="onLogout">Logout</button>
	  </div>
	</div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, watch, nextTick } from 'vue';
import { generateClient } from "aws-amplify/api";
import * as queries from "@/graphql/queries";
import * as mutations from "@/graphql/mutations";
import * as subscriptions from "@/graphql/subscriptions";
import * as models from "@/API";
import "@aws-amplify/ui-vue/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import * as myModels from "@/models/models";

const auth = useAuthenticator();
const messages = ref<models.Message>([]);
const inputContent = ref('');
const client = generateClient();
const createSub = ref<any>(null);
const user = ref<myModels.User>(auth.user); // リアクティブな参照としてユーザー情報を保持

watch(() => auth.user, (newUser: myModels.User) => {
  console.log("Authenticated user:", newUser);
  user.value = newUser; // ユーザー情報の更新
});

const onSendMessage = async () => {
	console.log(user.value.signInDetails.loginId, inputContent.value)
	await client.graphql({
		query: mutations.createMessage,
		variables: {
			input: {
				name: user.value.signInDetails.loginId,
				content: inputContent.value,
			}
		}
	});
	inputContent.value = "";
	await getMessages();
};

// メッセージを取得し、createdAtで降順に並び替える関数
const getMessages = async () => {
  const result = await client.graphql({
    query: queries.listMessages
  });

  // createdAtで降順に並び替え
  messages.value = result.data.listMessages.items.sort((a: models.Message, b: models.Message) => {
    // 日付をDateオブジェクトに変換して比較
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

// メッセージリストを監視し、変更があるたびに自動スクロール
watch(messages, async () => {
  await nextTick(); // DOMの更新を待つ
  const messagesContainer = document.querySelector('.messages');
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // スクロール位置を最下部に設定
  }
}, { deep: true }); // deepオプションでネストされたプロパティの変更も監視

onMounted(async () => {
	// Subscribe to creation of Todo
	await getMessages();
	createSub.value = client
		.graphql({ query: subscriptions.onCreateMessage })
		.subscribe({
			next: async (data: models.Message) => {
				console.log("triggered onCreateTodo");
				console.log(data);
				await getMessages();
			},
			error: (error: any) => console.warn(error)
	});
});

const onLogout = () => {
	auth.signOut();
};

onUnmounted(() => {
  if (createSub.value) {
	  createSub.value.unsubscribe();
  }
});
</script>

<style scoped lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.messages {
	flex: 1;
	overflow-y: auto;
	padding: 1em;
	border-bottom: 1px solid #ccc;

	.message {
		position: relative;
		margin-bottom: 1em;
		padding: 10px;
		// background: #e0e0e0;
		border-radius: 10px;
		width: fit-content;
		max-width: 80%;
		display: flex;
		gap: 2em;
	}
	.self {
	  background: #dcf8c6; /* 自分のメッセージ */
	  margin-left: auto;
	}
	.other {
	  background: #e0e0e0; /* 他の人のメッセージ */
	}
}


.input-area {
	display: flex;
	padding: 1em;
	border-top: 1px solid #ccc;
	& input {
		flex: 1;
		margin-right: 1em;
	}
	/* CSSでユーザーごとに異なるクラスを適用 */
}

.input-area textarea {
  flex: 1;
  margin-right: 1em;
  resize: none; /* ユーザーによるリサイズを無効化 */
}


</style>