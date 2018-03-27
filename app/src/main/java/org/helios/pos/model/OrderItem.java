package org.helios.pos.model;

public class OrderItem {
	int orderItemId;
	Item item;
	int quantity;
	int parcelCount;
	Status status;
	
	public int getOrderItemId() {
		return orderItemId;
	}

	public void setOrderItemId(int orderItemId) {
		this.orderItemId = orderItemId;
	}

	public Item getItem() {
		return item;
	}

	public void setItem(Item item) {
		this.item = item;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public int getParcelCount() {
		return parcelCount;
	}

	public void setParcelCount(int parcelCount) {
		this.parcelCount = parcelCount;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "ItemQuantity [item=" + item + ", quantity=" + quantity + "]";
	}
}