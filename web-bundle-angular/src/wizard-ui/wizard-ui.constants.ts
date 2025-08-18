const CONFIGURE_WIZARD = 'configure-wizard';
const SETUP_CONTROL_PLANE_NODE = 'setup-control-plane-node';
const ADD_WORKER_NODE = 'add-worker-node';
const UPDATE_CLUSTER_VERSION = 'update-cluster-version';
const AT_METAL_LOAD_BALANCER = 'add-metal-load-balancer';

export type RecipeTitles =
  | typeof CONFIGURE_WIZARD
  | typeof SETUP_CONTROL_PLANE_NODE
  | typeof ADD_WORKER_NODE
  | typeof UPDATE_CLUSTER_VERSION
  | typeof AT_METAL_LOAD_BALANCER;
export type Slide = {
  /**
   * each slide has a command that can be ran automatically or edited and ran from the vim editor
   */
  command: string;
  /**
   * An explanation of what the commnad does and the context of the task relative to the recipees goal
   */
  explanation: string;
};
export type Recipe = {
  recipeTitle: RecipeTitles;
  slides: Slide[];
};

export const RECIPE_TITLES: RecipeTitles[] = [CONFIGURE_WIZARD];

export const RECIPES: Recipe[] = [
  {
    recipeTitle: SETUP_CONTROL_PLANE_NODE,
    slides: [
      {
        command: `sudo apt update && sudo apt upgrade -y`,
        explanation: `Ensure your system is updated to the latest packages before starting the Kubernetes setup.`,
      },
      {
        command: `sudo apt install vim`,
        explanation: `Install Vim, a text editor that will be used to edit configuration files during the setup process.`,
      },
      {
        command: `sudo apt install curl`,
        explanation: `Install curl, a command-line tool for transferring data with URLs, which will be used to download necessary files during the setup.`,
      },
      {
        command: `sudo apt install -y containerd`,
        explanation: `Install containerd, which is the container runtime required for Kubernetes to manage containers.`,
      },
      {
        command: `sudo mkdir -p /etc/containerd && containerd config default | sudo tee /etc/containerd/config.toml`,
        explanation: `Create the containerd configuration directory and generate a default configuration file.`,
      },
      {
        command: `sudo vim /etc/containerd/config.toml`,
        explanation: `Edit the containerd configuration file to set the cgroup driver to systemd. Look for the line with 'SystemdCgroup = false' and change it to 'SystemdCgroup = true'.`,
      },
      {
        command: `sudo systemctl restart containerd && sudo systemctl enable containerd`,
        explanation: `Restart the containerd service to apply the changes and enable it to start on boot.`,
      },
      {
        command: `curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg && echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list`,
        explanation: `Add the Kubernetes apt repository to your system so you can install Kubernetes components.`,
      },
      {
        command: `sudo apt update && sudo apt install -y kubelet kubeadm kubectl && sudo apt-mark hold kubelet kubeadm kubectl`,
        explanation: `Install the Kubernetes components: kubelet (the node agent), kubeadm (the tool to bootstrap the cluster), and kubectl (the command-line tool to interact with the cluster). Mark them to prevent automatic updates. Comment out /swap.img line.`,
      },
      {
        command: `sudo swapoff -a && sudo vim /etc/fstab`,
        explanation: `Disable swap memory, which is required for Kubernetes to function properly.
            Comment out /swap.img → #/swap.img
            `,
      },
      {
        command: `cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
`,
        explanation: `Load necessary kernel modules for Kubernetes networking. This ensures that the network traffic is properly handled by the Linux kernel.`,
      },
      {
        command: `sudo modprobe overlay && sudo modprobe br_netfilter`,
        explanation: `Load the overlay and br_netfilter kernel modules, which are required for Kubernetes networking.`,
      },
      {
        command: `cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF`,
        explanation: `Configure sysctl parameters to ensure that the network bridge and IP forwarding are set up correctly for Kubernetes.`,
      },
      {
        command: `sudo sysctl --system`,
        explanation: `Apply the sysctl changes to ensure that the new settings take effect immediately.`,
      },
      {
        command: `sudo kubeadm init --pod-network-cidr=10.244.0.0/16`,
        explanation: `Initialize the Kubernetes control plane. The pod network CIDR is specified for the pod network add-on to use.`,
      },
      {
        command: `mkdir -p $HOME/.kube && sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config && sudo chown $(id -u):$(id -g) $HOME/.kube/config`,
        explanation: `Set up kubectl for your user by copying the admin configuration file to your home directory and changing ownership so you can use kubectl commands.`,
      },
      {
        command: `kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml`,
        explanation: `Install Flannel as the pod network add-on, which provides networking for the pods in the Kubernetes cluster.`,
      },
      {
        command: `sudo shutdown -r now`,
        explanation: `Reboot the system to ensure all changes take effect and the Kubernetes components are properly initialized. And can handle a computer restart`,
      },
    ],
  },
  {
    recipeTitle: ADD_WORKER_NODE,
    slides: [
      {
        command: `sudo apt update && sudo apt upgrade -y`,
        explanation: `Ensure your system is updated to the latest packages before starting the Kubernetes setup.`,
      },
      {
        command: `sudo apt install vim`,
        explanation: `Install Vim, a text editor that will be used to edit configuration files during the setup process.`,
      },
      {
        command: `sudo apt install curl`,
        explanation: `Install curl, a command-line tool for transferring data with URLs, which will be used to download necessary files during the setup.`,
      },
      {
        command: `sudo swapoff -a && sudo vim /etc/fstab`,
        explanation: `Disable swap memory, which is required for Kubernetes to function properly.
            Comment out /swap.img → #/swap.img
            `,
      },
      {
        command:
          'sudo apt install -y apt-transport-https ca-certificates curl gpg',
        explanation: 'Install required packages.',
      },
      {
        command: `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`,
        explanation: 'Add Docker Repository',
      },
      {
        command: `sudo apt update
sudo apt install -y containerd.io`,
        explanation: 'Install containerd',
      },
      {
        command: `sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml

# Enable SystemdCgroup
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl enable containerd`,
        explanation: `Configure Containerd`,
      },
      {
        command: `curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg && echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list`,
        explanation: `Add the Kubernetes apt repository to your system so you can install Kubernetes components.`,
      },
      {
        command: `sudo apt update
sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

sudo systemctl enable kubelet`,
        explanation: `Install kubelet, kubeadm, kubectl`,
      },
      {
        command: `
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
`,
        explanation: 'Load Required Kernel Modules',
      },
      {
        command: `cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sudo sysctl --system`,
        explanation: `Set Sysctl Parameters`,
      },
      {
        explanation:
          'Go to the control plane and create your command to join the your worker node, then run the command on the worker node',
        command: 'kubeadm token create --print-join-command',
      },
      {
        explanation: `After you joined the worker node to the control plane, you can run the following command to check the status of the nodes in the cluster.`,
        command: `kubectl get nodes`,
      },
    ],
  },
  {
    recipeTitle: UPDATE_CLUSTER_VERSION,
    slides: [
      {
        command: `curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.XX/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg && echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.XX/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list`,
        explanation: `Replace the XX with the version you want to update to (IMPORTANT: must be the next minor version 1.33 → 1.34), e.g., 1.38. To install the correct apt package manager  kubernetes docker repo to retrieve your binaries from`,
      },
      {
        command: `sudo apt update && sudo apt-cache show kubeadm`,

        explanation: `Update the package list and show available kubeadm versions. This will help you confirm the version you want to upgrade to. Copy the version you want to update to to your clipboard`,
      },
      {
        command: `sudo apt-get update && sudo apt-get install -y kubeadm=1.XX.X-X.X`,
        explanation: `Use the version copied to your clipbard to install the next minor version of kubeadm from your new repo`,
      },
      {
        command: `sudo kubeadm upgrade apply v1.XX.X`,
        explanation: `Apply the upgrade to your Kubernetes cluster. Importantly make sure to use the right version number format and omit the extra suffixed numbers.`,
      },
      {
        command: `sudo apt install -y --allow-change-held-packages kubelet=1.XX.X-0 kubectl=1.XX.X-0`,
        explanation: `Install the updated kubelet and kubectl versions to match the kubeadm version you just upgraded to.`,
      },
      {
        command: `sudo systemctl restart kubelet`,
        explanation: `Restart the kubelet service to apply changes.`,
      },

      {
        explanation: `For each worker node complete the follwowing steps`,
        command: '',
      },
      {
        command: `curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.XX/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg && echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.XX/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list`,
        explanation: `Replace the XX with the version you want to update to (IMPORTANT: must be the next minor version 1.33 → 1.34), e.g., 1.38. To install the correct apt package manager  kubernetes docker repo to retrieve your binaries from`,
      },
      {
        command: `sudo apt update && sudo apt-cache show kubeadm`,

        explanation: `Update the package list and show available kubeadm versions. This will help you confirm the version you want to upgrade to. Copy the version you want to update to to your clipboard`,
      },
      {
        command: `sudo apt-get update && sudo apt-get install -y --allow-change-held-packages kubeadm=1.XX.X-X.X`,
        explanation: `Use the version copied to your clipbard to install the next minor version of kubeadm from your new repo`,
      },
      {
        command: `sudo kubeadm upgrade node`,
        explanation: `Apply the upgrade to your Kubernetes worker node. Importantly make sure to use the right version number format and omit the extra suffixed numbers.`,
      },
      {
        command: `sudo apt install -y --allow-change-held-packages kubelet=1.XX.X-0 kubectl=1.XX.X-0`,
        explanation: `Install the updated kubelet and kubectl versions to match the kubeadm version you just upgraded to.`,
      },
      {
        command: `sudo systemctl restart kubelet`,
        explanation: `Restart the kubelet service to apply changes.`,
      },
    ],
  },
  {
    recipeTitle: AT_METAL_LOAD_BALANCER,
    slides: [
      {
        explanation: `This video has a good walk through explanation for installing matallb with ingress`,
        command: `https://www.youtube.com/watch?v=k8bxtsWe9qw`,
      },
      {
        explanation: `Change the load balancing mode to ipvs (ip virtual server) instead of ip tables for better performance and to support metallb.

          apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: "ipvs"
ipvs:
  strictARP: true
          `,
        command: `kubectl edit configmap kube-proxy -n kube-system`,
      },
      {
        explanation: `Apply changes by restarting kube-proxy`,
        command: `kubectl rollout restart daemonset kube-proxy -n kube-system`,
      },
      {
        explanation: `Install the metallb kubernetes manifests`,
        command: `kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.15.2/config/manifests/metallb-native.yaml`,
      },
      {
        explanation: `Add the metallb custom resources IPAddressPool and L2Advertisement to your cluster. This is necessary to configure the IP address pool that metallb will use for load balancing.`,
        command: `apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default-pool
  namespace: metallb-system
spec:
  addresses:
  - <first-ip>-<last-ip> # Adjust to your network range
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default-l2advertisement
  namespace: metallb-system
spec:
  ipAddressPools:
  - default-pool`,
      },
      {
        explanation: `Check the ip adresses range your router is using and assign a seperate range to your load balancer. You may also want to check your kubernetes cidr block kubectl get nodes -o jsonpath='{.items[*].spec.podCIDR}' to make sure there's no overlaps`,
        command: `apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - <first-ip>-<last-ip>`,
      },
      {
        explanation: `Apply the configmap to your cluster`,
        command: `kubectl apply -f <path-to-configmap>.yaml`,
      },
      {
        explanation: `Create a LoadBalancer service to test metallb`,
        command: `apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer`,
      },
      {
        explanation: `Apply the service to your cluster`,
        command: `kubectl apply -f <path-to-service>.yaml`,
      },
      {
        explanation: `Check the status of the service to see if it has been assigned an external IP address by metallb`,
        command: `kubectl get svc nginx-service`,
      },
    ],
  },
];
