export interface User {
	username: string;
	userId: string;
	signInDetails: {
		loginId: string;
		authFlowType: string;
	}
}