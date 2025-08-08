import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ClusterNode {
  id: string;
  ipAddress: string;
  nodeType: 'worker' | 'control-plane';
  isEditing?: boolean;
}

@Component({
  selector: 'wizard-cluster-ip-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './cluster-ip-info.component.html',
  styleUrl: './cluster-ip-info.component.scss',
})
export class ClusterIpInfoComponent {
  nodes: ClusterNode[] = [];
  newNode: ClusterNode = { id: '', ipAddress: '', nodeType: 'worker' };

  addNode() {
    if (this.newNode.ipAddress.trim()) {
      console.log(1);
      const node: ClusterNode = {
        id: this.generateId(),
        ipAddress: this.newNode.ipAddress.trim(),
        nodeType: this.newNode.nodeType,
      };
      this.nodes.push(node);
      this.newNode = { id: '', ipAddress: '', nodeType: 'worker' };
    }
    console.log(2);
  }

  editNode(node: ClusterNode) {
    node.isEditing = true;
  }

  saveNode(node: ClusterNode) {
    if (node.ipAddress.trim()) {
      node.isEditing = false;
    }
  }

  cancelEdit(node: ClusterNode) {
    node.isEditing = false;
  }

  deleteNode(nodeId: string) {
    this.nodes = this.nodes.filter((node) => node.id !== nodeId);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
