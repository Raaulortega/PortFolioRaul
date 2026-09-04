import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Google Translate (and similar page translators) mutates the DOM directly,
// wrapping text nodes in <font> tags. When React later tries to reconcile
// that same subtree, removeChild/insertBefore can be called on nodes that
// no longer match the live DOM, throwing an uncaught NotFoundError that
// crashes the whole React tree (blank/black screen). Make these two calls
// no-ops when the node isn't actually a child, instead of throwing.
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
