# Install Kind 
- On macOS via Homebrew:
    ```bash
    brew install kind
    ```

- On macOS via MacPorts:
    ```bash
    sudo port selfupdate && sudo port install kind
    ```

# Setup Kind K8s Cluster
- Setting k8 1.19 version
    ```bash
        kubectl apply -f kind-k8-1.19.yaml
    ```

- Setting Nginx Ingress Controller v0.35.0
    ```bash
        $ kubectl apply -f https://raw.githubusercontent.com/abhioncbr/kubernetes-Example/master/K8s-ingress/nginx-ingress-controller/kind/nginx-controller-v0.35.0.yaml
    ```