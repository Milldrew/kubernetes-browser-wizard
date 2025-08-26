import { Recipe } from './wizard-ui.constants';

export const ISSUE_A_KUBECONFIG_FILE_RECIPE =
  'issue-a-kubeconfig-file-to-a-user';

const ISSUE_A_KUBECONFIG_FILE_TO_A_USER_RECIPE: Recipe = {
  recipeTitle: ISSUE_A_KUBECONFIG_FILE_RECIPE,
  slides: [
    {
      explanation: `Create a private key and a certificate signing request (CSR) for the user.`,
      command: `openssl genrsa -out <username>.key 2048 \
&& openssl req -new -key <username>.key -out <username>.csr -subj "/CN=<username>/O=<group>"`,
    },
    {
      explanation: `Create a kubernetes certificate signing request resource using the CSR created in the previous step.`,
      command: `# readonly-user-csr.yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: readonly-user
spec:
  request: <BASE64_ENCODED_CSR>
  signerName: kubernetes.io/kube-apiserver-client
  usages:
  - client auth
  `,
    },
    {
      explanation: `Change the csr certificate to a one-liner base64 encoded string. Add the output to the readonly-user-csr.yaml file created in the previous step, replacing <BASE64_ENCODED_CSR> string`,
      command: `cat <username>.csr | base64 | tr -d '\\n'`,
    },
    {
      explanation: `Submit the CSR to the Kubernetes cluster.`,
      command: `kubectl apply -f readonly-user-csr.yaml`,
    },
    {
      explanation: `Approve the CSR.`,
      command: `kubectl get csr && kubectl certificate approve readonly-user`,
    },
    {
      explanation: `Retrieve the signed certificate and save it to a file.`,
      command: `kubectl get csr readonly-user -o jsonpath='{.status.certificate}' | base64 --decode > readonly-user.crt`,
    },
    {
      explanation: `Create the clusterrole and the clusterrolebinding for the user.`,
      command: `kubectl create clusterrolebinding readonly-user-binding --clusterrole=view --user=readonly-user
      kubectl create clusterrole readonly-user --verb=get,list,watch --resource=pods,deployments`,
    },
    {
      explanation: `Get the clustername and the endpoint for the kubeconfig file, and create a file for the certificate authority`,
      command: `kubectl config view --minify -o jsonpath='{.clusters[0].name}'
      kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
     kubectl config view --minify -o jsonpath='{.clusters[0].cluster.certificate-authority-data}' | base64 --decode > ca.crt
      `,
    },
    {
      explanation: `Create the kubeconfig file for the user.`,
      command: `kubectl config set-cluster <cluster-name> --server=<api-server-endpoint> --certificate-authority=<path-to-ca-cert> --kubeconfig=<username>-kubeconfig
`,
    },
    {
      explanation: `add the user credentials to the kubeconfig file.`,
      command: `kubectl config set-credentials <username> --client-certificate=<path-to-signed-cert> --client-key=<path-to-private-key> --embed-certs=true --kubeconfig=readonly-kubeconfig.yaml`,
    },
    {
      explanation: `Set the context for the kubeconfig file.`,
      command: `kubectl config set-context <username>-context --cluster=<cluster-name> --user=<username> --kubeconfig=<username>-kubeconfig`,
    },
    {
      explanation: `Use the context in the kubeconfig file.`,
      command: `kubectl config use-context <username>-context --kubeconfig=<username>-kubeconfig`,
    },
    {
      explanation: `Test the kubeconfig file by listing the pods in the cluster.`,
      command: `kubectl get pods --kubeconfig=<username>-kubeconfig`,
    },
    {
      explanation: `Try creating a resource to verify that the user has read-only access.`,
      command: `kubectl create deployment nginx --image=nginx --kubeconfig=<username>-kubeconfig`,
    },
  ],
};
