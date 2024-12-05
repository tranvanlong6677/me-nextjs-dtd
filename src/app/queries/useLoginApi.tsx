import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginApi = () =>
  useMutation({ mutationFn: authApiRequest.login });
