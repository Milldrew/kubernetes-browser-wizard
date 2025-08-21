import {
  Recipe,
  SETUP_LOCAL_CLUSTER_CONTAINER_REGISTRY,
} from './wizard-ui.constants';
export const SETUP_CONTAINER_REGISTRY_RECIPE: Recipe = {
  recipeTitle: SETUP_LOCAL_CLUSTER_CONTAINER_REGISTRY,
  slides: [
    {
      explanation: `Setup an http docker registry in your cluster, using a node port`,
      command: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: registry-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/registry
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: registry-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docker-registry
  labels:
    app: docker-registry
spec:
  replicas: 1
  selector:
    matchLabels:
      app: docker-registry
  template:
    metadata:
      labels:
        app: docker-registry
    spec:
      containers:
      - name: registry
        image: registry:2
        ports:
        - containerPort: 5000
        env:
        - name: REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY
          value: /var/lib/registry
        volumeMounts:
        - name: registry-storage
          mountPath: /var/lib/registry
      volumes:
      - name: registry-storage
        persistentVolumeClaim:
          claimName: registry-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: docker-registry-service
  labels:
    app: docker-registry
spec:
  type: NodePort
  ports:
  - port: 5000
    targetPort: 5000
    nodePort: 30500  # Optional: specify a port in range 30000-32767
    protocol: TCP
  selector:
    app: docker-registry`,
    },
    {
      explanation: `Configure your docker daemon to interact with your local registry`,
      command: `{
  "insecure-registries": ["192.168.0.153:30500"]
}
      `,
    },
    {
      explanation: `Test the repo replace the IP with the IP to one of your worker nodes`,
      command: `docker image pull hello-world
#test-cluster-container-registry
## Tag an image for your registry
docker tag hello-world 192.168.0.153:30500/hello-world

# Push to your registry
docker push 192.168.0.153:30500/hello-world

# Pull from your registry
docker pull 192.168.0.153:30500/hello-world

`,
    },
  ],
};
// sudo ctr images pull docker.io/library/registry:3
