---
name: workflow-industry-retail
description: "Retail/e-commerce workflows (orders, inventory, shipping). Use when asking 'retail workflow', 'e-commerce', 'order processing', or 'inventory sync'."
---

# Retail/E-Commerce Workflows

> **Skill Metadata**
> Category: `industry-workflows`
> Priority: `MEDIUM`
> SDK Version: `0.9.25+`

## Pattern: Order Fulfillment Workflow

```python
import pandas as pd

workflow = Pipeline()

# 1. Receive order
pipeline.add_step("DatabaseExecuteNode", "create_order", {
    "query": "INSERT INTO orders (customer_id, items, total) VALUES (?, ?, ?)",
    "parameters": ["{{input.customer_id}}", "{{input.items}}", "{{input.total}}"]
})

# 2. Check inventory
pipeline.add_step("DatabaseQueryNode", "check_inventory", {
    "query": "SELECT quantity FROM inventory WHERE product_id = ?",
    "parameters": ["{{input.product_id}}"]
})

# 3. Reserve stock
pipeline.add_step("DatabaseExecuteNode", "reserve_stock", {
    "query": "UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?",
    "parameters": ["{{input.quantity}}", "{{input.product_id}}"]
})

# 4. Process payment
pipeline.add_step("APICallNode", "payment", {
    "url": "https://api.stripe.com/charges",
    "method": "POST",
    "body": {"amount": "{{input.total}}", "customer": "{{input.customer_id}}"}
})

# 5. Create shipping label
pipeline.add_step("APICallNode", "shipping", {
    "url": "https://api.shippo.com/shipments",
    "method": "POST",
    "body": {"address": "{{input.address}}", "weight": "{{input.weight}}"}
})

# 6. Send confirmation
pipeline.add_step("APICallNode", "notify_customer", {
    "url": "https://api.sendgrid.com/mail/send",
    "method": "POST",
    "body": {"to": "{{input.email}}", "subject": "Order Confirmed", "tracking": "{{shipping.tracking_number}}"}
})

pipeline.connect("create_order", "order_id", "check_inventory", "order_id")
pipeline.connect("check_inventory", "quantity", "reserve_stock", "available")
pipeline.connect("reserve_stock", "result", "payment", "body")
pipeline.connect("payment", "transaction_id", "shipping", "payment_ref")
pipeline.connect("shipping", "tracking_number", "notify_customer", "tracking")
```

<!-- Trigger Keywords: retail workflow, e-commerce, order processing, inventory sync, order fulfillment -->
