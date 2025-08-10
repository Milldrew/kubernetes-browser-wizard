const CONFIGURE_WIZARD = 'configure-wizard';
const SETUP_CONTROL_PLANE_NODE = 'setup-control-plane-node';
const ADD_WORKER_NODE = 'add-worker-node';

export type RecipeTitles =
  | typeof CONFIGURE_WIZARD
  | typeof SETUP_CONTROL_PLANE_NODE
  | typeof ADD_WORKER_NODE;
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
];
