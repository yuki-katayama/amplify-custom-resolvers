<template>
	<div class="chat-container">
		<div class="messages" v-if="messages.length>0">
			<div v-for="message in messages" :key="message.id" class="message"
				:class="message.name===user.signInDetails.loginId? 'self':'other'">
				<div class="message-bubble">
					<p>{{message.content}}</p>
					<figure>
						<img v-if="message.imgUrl" :src="message.imgUrl.url.href" alt="Message Image" width="100%"
							height="100%" />
					</figure>
				</div>
				<p>{{message.name}}</p>
				<span class="timestamp">{{formatDate(message.createdAt)}}</span>
			</div>
		</div>
		<div class="input-area">
			<textarea v-model="inputMessage" placeholder="Type a message"></textarea>
			<v-btn @click="onSendMessage">Send</v-btn>
			<v-btn @click="onLogout">Logout</v-btn>
		</div>
		<div>
			<v-file-input v-model="fileinput" label="File input" clearable></v-file-input>
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
import * as storage from 'aws-amplify/storage'


const auth=useAuthenticator();
const client=generateClient();
const createSub=ref<any>(null);

const user=ref<myModels.User>(auth.user); // リアクティブな参照としてユーザー情報を保持
const messages=ref<models.Message[]>([]);
const inputMessage=ref('');

const fileinput=ref<File[]>([])

const formatDate=(date: string) => {
	const originalDate=new Date("2024-04-07T20:15:30.971Z");

	const month=String(originalDate.getMonth()+1).padStart(2, '0'); // 月は0-indexedなので+1する
	const day=String(originalDate.getDate()).padStart(2, '0');
	const hours=String(originalDate.getHours()).padStart(2, '0');
	const minutes=String(originalDate.getMinutes()).padStart(2, '0');

	const formattedDate=`${month}/${day} ${hours}:${minutes}`;
	return formattedDate;
}
const uploadFiles=async () => {
	console.log(fileinput.value[0])
	if (fileinput.value.length>0) {
		try {
			return await storage.uploadData({
				key: fileinput.value[0].name,
				data: fileinput.value[0],
			}).result;
		} catch (error) {
			console.log('Error : ', error);
		}
	}
	return null;
};

watch(() => auth.user, (newUser: myModels.User) => {
	console.log("Authenticated user:", newUser);
	user.value=newUser; // ユーザー情報の更新
});

const onSendMessage=async () => {
	console.log(user.value.signInDetails.loginId, inputMessage.value)
	const file=await uploadFiles();
	await client.graphql({
		query: mutations.createMessage,
		variables: {
			input: {
				name: user.value.signInDetails.loginId,
				content: inputMessage.value,
				img: file? file.key:""
			}
		}
	});
	inputMessage.value="";
};

// メッセージを取得し、createdAtで降順に並び替える関数
const getMessages=async () => {
	const result=await client.graphql({
		query: queries.listMessages
	});

	const messagesWithImgUrl=await Promise.all(result.data.listMessages.items.map(async (message: models.Message) => {
		if (message.img) {
			console.log(message.img);
			message.imgUrl=await storage.getUrl({
				key: message.img,
				options: {
					expiresIn: 60*60
				}
			});
			//   message.imgUrl = imgData.url.toString(); // 画像のURLをメッセージオブジェクトに追加
			//   console.log(imgData); 
			console.log(message.imgUrl)
		}
		return message;
	}));

	messages.value=messagesWithImgUrl.sort((a, b) => new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime());
};


// メッセージリストを監視し、変更があるたびに自動スクロール
watch(messages, async () => {
	await nextTick(); // DOMの更新を待つ
	const messagesContainer=document.querySelector('.messages');
	if (messagesContainer) {
		messagesContainer.scrollTop=messagesContainer.scrollHeight; // スクロール位置を最下部に設定
	}
}, { deep: true }); // deepオプションでネストされたプロパティの変更も監視

onMounted(async () => {
	// Subscribe to creation of Todo
	await getMessages();
	createSub.value=client
		.graphql({ query: subscriptions.onCreateMessage })
		.subscribe({
			next: async (data: any) => {
				console.log("triggered onCreateTodo");
				console.log(data);
				await getMessages();
			},
			error: (error: any) => console.warn(error)
		});
});

const onLogout=() => {
	auth.signOut();
};

onUnmounted(() => {
	if (createSub.value) {
		createSub.value.unsubscribe();
	}
});
</script>

<style scoped lang="scss">
figure {
	min-width: 20%;
}

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
	// width: 50vw;

	.message {
		position: relative;
		margin-bottom: 1em;
		padding: 1em;
		// background: #e0e0e0;
		border-radius: 10px;
		width: 100%;
		max-width: 80%;
		display: flex;
		gap: 2em;
	}

	.self {
		background: #dcf8c6;
		/* 自分のメッセージ */
		margin-left: auto;
	}

	.other {
		background: #e0e0e0;
		/* 他の人のメッセージ */
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
	resize: none;
	/* ユーザーによるリサイズを無効化 */
}
</style>