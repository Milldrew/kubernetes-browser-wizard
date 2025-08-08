import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ClusterNode {
  id: string;
  ipAddress: string;
  nodeType: 'worker' | 'control-plane';
  nickname?: string;
  isEditing?: boolean;
  isConfigured?: boolean;
  username?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CoreStateService {
  showClusterIpInfo = false;
  showWizardAndTerminal = false;
  hasClusterIpInfo = false;

  private readonly STORAGE_KEY = 'cluster-nodes';
  private clusterNodesSubject = new BehaviorSubject<ClusterNode[]>([]);
  public clusterNodes$ = this.clusterNodesSubject.asObservable();

  constructor() {
    this.loadNodesFromStorage();
  }

  showTerminal() {
    this.showWizardAndTerminal = true;
    this.showClusterIpInfo = false;
  }

  showClusterIpInfoNow() {
    this.showWizardAndTerminal = false;
    this.showClusterIpInfo = true;
  }

  // Cluster Nodes Management
  getClusterNodes(): ClusterNode[] {
    return this.clusterNodesSubject.value;
  }

  addClusterNode(node: Omit<ClusterNode, 'id'>): void {
    const newNode: ClusterNode = {
      ...node,
      id: this.generateId(),
    };
    const currentNodes = this.getClusterNodes();
    const updatedNodes = [...currentNodes, newNode];
    this.updateClusterNodes(updatedNodes);
  }

  updateClusterNode(nodeId: string, updates: Partial<ClusterNode>): void {
    const currentNodes = this.getClusterNodes();
    const updatedNodes = currentNodes.map((node) =>
      node.id === nodeId ? { ...node, ...updates } : node,
    );
    this.updateClusterNodes(updatedNodes);
  }

  deleteClusterNode(nodeId: string): void {
    const currentNodes = this.getClusterNodes();
    const updatedNodes = currentNodes.filter((node) => node.id !== nodeId);
    this.updateClusterNodes(updatedNodes);
  }

  private updateClusterNodes(nodes: ClusterNode[]): void {
    this.clusterNodesSubject.next(nodes);
    this.saveNodesToStorage(nodes);
    this.hasClusterIpInfo = nodes.length > 0;
  }

  private saveNodesToStorage(nodes: ClusterNode[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nodes));
    } catch (error) {
      console.error('Error saving cluster nodes to localStorage:', error);
    }
  }

  private loadNodesFromStorage(): void {
    try {
      const storedNodes = localStorage.getItem(this.STORAGE_KEY);
      if (storedNodes) {
        const nodes: ClusterNode[] = JSON.parse(storedNodes);
        this.clusterNodesSubject.next(nodes);
        this.hasClusterIpInfo = nodes.length > 0;
      }
    } catch (error) {
      console.error('Error loading cluster nodes from localStorage:', error);
      this.clusterNodesSubject.next([]);
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
