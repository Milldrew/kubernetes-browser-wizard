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
    ],
  },
];
// Here's how to set up Kubernetes on Ubuntu 24.04:

// ## Prerequisites

// First, ensure your system is updated:
// ```bash
// sudo apt update && sudo apt upgrade -y
// ```

// ## Install Container Runtime (containerd)

// 1. Install containerd:
// ```bash
// sudo apt install -y containerd
// ```

// 2. Configure containerd:
// ```bash
// sudo mkdir -p /etc/containerd
// containerd config default | sudo tee /etc/containerd/config.toml
// ```

// 3. Edit the config to use systemd cgroup driver:
// ```bash
// sudo nano /etc/containerd/config.toml
// ```

// Find the line with `SystemdCgroup = false` and change it to `SystemdCgroup = true`.

// 4. Restart containerd:
// ```bash
// sudo systemctl restart containerd
// sudo systemctl enable containerd
// ```

// ## Install Kubernetes Components

// 1. Add Kubernetes apt repository:
// ```bash
// curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
// echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
// ```

// 2. Update package index and install:
// ```bash
// sudo apt update
// sudo apt install -y kubelet kubeadm kubectl
// sudo apt-mark hold kubelet kubeadm kubectl
// ```

// ## System Configuration

// 1. Disable swap:
// ```bash
// sudo swapoff -a
// sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
// ```

// 2. Load required kernel modules:
// ```bash
// cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
// overlay
// br_netfilter
// EOF

// sudo modprobe overlay
// sudo modprobe br_netfilter
// ```

// 3. Configure sysctl parameters:
// ```bash
// cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
// net.bridge.bridge-nf-call-iptables  = 1
// net.bridge.bridge-nf-call-ip6tables = 1
// net.ipv4.ip_forward                 = 1
// EOF

// sudo sysctl --system
// ```

// ## Initialize Kubernetes Cluster

// 1. Initialize the control plane:
// ```bash
// sudo kubeadm init --pod-network-cidr=10.244.0.0/16
// ```

// 2. Set up kubectl for your user:
// ```bash
// mkdir -p $HOME/.kube
// sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
// sudo chown $(id -u):$(id -g) $HOME/.kube/config
// ```

// ## Install a Pod Network Add-on

// Install Flannel for pod networking:
// ```bash
// kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
// ```

// ## Allow Pods on Control Plane (Optional)

// If this is a single-node cluster, remove the taint that prevents pods from running on the control plane:
// ```bash
// kubectl taint nodes --all node-role.kubernetes.io/control-plane-
// ```

// ## Verify Installation

// Check that all components are running:
// ```bash
// kubectl get nodes
// kubectl get pods -A
// ```

// Your Kubernetes cluster should now be ready! If you plan to add worker nodes, use the `kubeadm join` command that was displayed after the `kubeadm init` step.
