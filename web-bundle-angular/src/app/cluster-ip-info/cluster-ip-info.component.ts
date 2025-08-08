import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ClusterNode {
  id: string;
  ipAddress: string;
  nodeType: 'worker' | 'control-plane';
  nickname?: string;
  isEditing?: boolean;
}

@Component({
  selector: 'wizard-cluster-ip-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './cluster-ip-info.component.html',
  styleUrl: './cluster-ip-info.component.scss',
})
export class ClusterIpInfoComponent implements OnInit {
  nodes: ClusterNode[] = [];
  newNode: ClusterNode = { id: '', ipAddress: '', nodeType: 'worker', nickname: '' };
  private readonly STORAGE_KEY = 'cluster-nodes';

  ngOnInit() {
    this.loadNodesFromStorage();
  }

  addNode() {
    if (this.newNode.ipAddress.trim()) {
      const node: ClusterNode = {
        id: this.generateId(),
        ipAddress: this.newNode.ipAddress.trim(),
        nodeType: this.newNode.nodeType,
        nickname: this.newNode.nickname?.trim() || '',
      };
      this.nodes.push(node);
      this.saveNodesToStorage();
      this.newNode = { id: '', ipAddress: '', nodeType: 'worker', nickname: '' };
    }
  }

  editNode(node: ClusterNode) {
    node.isEditing = true;
  }

  saveNode(node: ClusterNode) {
    if (node.ipAddress.trim()) {
      node.isEditing = false;
      this.saveNodesToStorage();
    }
  }

  cancelEdit(node: ClusterNode) {
    node.isEditing = false;
  }

  deleteNode(nodeId: string) {
    this.nodes = this.nodes.filter((node) => node.id !== nodeId);
    this.saveNodesToStorage();
  }

  copyToClipboard(text: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        this.showCopyFeedback(event.target as HTMLElement);
      }).catch(() => {
        this.fallbackCopyToClipboard(text, event.target as HTMLElement);
      });
    } else {
      this.fallbackCopyToClipboard(text, event.target as HTMLElement);
    }
  }

  private fallbackCopyToClipboard(text: string, element: HTMLElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyFeedback(element);
    } catch (err) {
      console.error('Fallback: Could not copy text: ', err);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  private showCopyFeedback(element: HTMLElement) {
    const originalText = element.textContent;
    element.textContent = 'Copied!';
    element.style.color = '#28a745';
    
    setTimeout(() => {
      element.textContent = originalText;
      element.style.color = '';
    }, 1000);
  }

  private saveNodesToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.nodes));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private loadNodesFromStorage() {
    try {
      const storedNodes = localStorage.getItem(this.STORAGE_KEY);
      if (storedNodes) {
        this.nodes = JSON.parse(storedNodes);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.nodes = [];
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
