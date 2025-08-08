import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoreStateService, ClusterNode } from '../../core-state.service';

@Component({
  selector: 'wizard-cluster-ip-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './cluster-ip-info.component.html',
  styleUrl: './cluster-ip-info.component.scss',
})
export class ClusterIpInfoComponent implements OnInit, OnDestroy {
  nodes: ClusterNode[] = [];
  newNode: Partial<ClusterNode> = { ipAddress: '', nodeType: 'worker', nickname: '', username: '', password: '', isConfigured: false };
  private subscription: Subscription = new Subscription();

  constructor(private coreStateService: CoreStateService) {}

  ngOnInit() {
    this.subscription.add(
      this.coreStateService.clusterNodes$.subscribe(nodes => {
        this.nodes = nodes;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addNode() {
    if (this.newNode.ipAddress?.trim()) {
      this.coreStateService.addClusterNode({
        ipAddress: this.newNode.ipAddress.trim(),
        nodeType: this.newNode.nodeType || 'worker',
        nickname: this.newNode.nickname?.trim() || '',
        username: this.newNode.username?.trim() || '',
        password: this.newNode.password?.trim() || '',
        isConfigured: this.newNode.isConfigured || false,
      });
      this.newNode = { ipAddress: '', nodeType: 'worker', nickname: '', username: '', password: '', isConfigured: false };
    }
  }

  editNode(node: ClusterNode) {
    this.coreStateService.updateClusterNode(node.id, { isEditing: true });
  }

  saveNode(node: ClusterNode) {
    if (node.ipAddress.trim()) {
      this.coreStateService.updateClusterNode(node.id, { 
        ipAddress: node.ipAddress.trim(),
        nodeType: node.nodeType,
        nickname: node.nickname?.trim() || '',
        username: node.username?.trim() || '',
        password: node.password?.trim() || '',
        isConfigured: node.isConfigured || false,
        isEditing: false 
      });
    }
  }

  cancelEdit(node: ClusterNode) {
    this.coreStateService.updateClusterNode(node.id, { isEditing: false });
  }

  deleteNode(nodeId: string) {
    this.coreStateService.deleteClusterNode(nodeId);
  }

  generateSshCommand(node: ClusterNode): string {
    if (node.ipAddress) {
      if (node.username) {
        return `ssh ${node.username}@${node.ipAddress}`;
      } else {
        return `ssh ${node.ipAddress}`;
      }
    }
    return '';
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
}
