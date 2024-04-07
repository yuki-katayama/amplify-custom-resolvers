import { defineNuxtPlugin } from "#app";
import { Amplify } from "aws-amplify";
import awsExports from "@/aws-exports";

export default defineNuxtPlugin(() => {
  Amplify.configure(awsExports, {
    Storage: {
      S3: {
        // configures default access level
        // defaultAccessLevel: 'protected'
      }
    }
  });
});