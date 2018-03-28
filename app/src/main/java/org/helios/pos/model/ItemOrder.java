package org.helios.pos.model;

import java.util.List;

public class ItemOrder {
	int orderId;
	String storeId;
	Store store;
	List<OrderItem> orderedItems;
	String orderDate;
	List<PaymentType> paymentTypes;
	float totalAmount;
	User user;
	Status status;
	int direct;
	int active;
	int syncStatus;

	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	public int getOrderId() {
		return orderId;
	}

	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}

	public String getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(String orderDate) {
		this.orderDate = orderDate;
	}

	public List<OrderItem> getOrderedItems() {
		return orderedItems;
	}

	public void setOrderedItems(List<OrderItem> itemquan) {
		this.orderedItems = itemquan;
	}

	public List<PaymentType> getPaymentTypes() {
		return paymentTypes;
	}

	public void setPaymentTypes(List<PaymentType> paymentTypes) {
		this.paymentTypes = paymentTypes;
	}

	public float getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(float totalAmount) {
		this.totalAmount = totalAmount;
	}

	public int getActive() {
		return active;
	}

	public void setActive(int active) {
		this.active = active;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getStoreId() {
		return storeId;
	}

	public void setStoreId(String storeId) {
		this.storeId = storeId;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public int getDirect() {
		return direct;
	}

	public void setDirect(int direct) {
		this.direct = direct;
	}

	public int getSyncStatus() {
		return syncStatus;
	}

	public void setSyncStatus(int syncStatus) {
		this.syncStatus = syncStatus;
	}

	@Override
	public String toString() {
		return "ItemOrder [orderId=" + orderId + ", orderedItems=" + orderedItems + ", orderDate=" + orderDate
				+ ", paymentTypes=" + paymentTypes + ", totalAmount=" + totalAmount + ", active=" + active + "]";
	}

	public ItemOrder(int orderId, String storeId, Store store, List<OrderItem> orderedItems, String orderDate, List<PaymentType> paymentTypes, float totalAmount, User user, Status status, int direct, int active) {
		this.orderId = orderId;
		this.storeId = storeId;
		this.store = store;
		this.orderedItems = orderedItems;
		this.orderDate = orderDate;
		this.paymentTypes = paymentTypes;
		this.totalAmount = totalAmount;
		this.user = user;
		this.status = status;
		this.direct = direct;
		this.active = active;
	}

	public ItemOrder() {
	}
}