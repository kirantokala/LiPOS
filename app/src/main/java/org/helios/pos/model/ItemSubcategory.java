package org.helios.pos.model;

public class ItemSubcategory {
	int subcategoryId;
	String subcategoryName;
	String subcategoryDescription;
	ItemCategory category;
	String image;
	int active;

	public int getSubcategoryId() {
		return subcategoryId;
	}

	public void setSubcategoryId(int subcategoryId) {
		this.subcategoryId = subcategoryId;
	}

	public String getSubcategoryName() {
		return subcategoryName;
	}

	public void setSubcategoryName(String subcategoryName) {
		this.subcategoryName = subcategoryName;
	}

	public String getSubcategoryDescription() {
		return subcategoryDescription;
	}

	public void setSubcategoryDescription(String subcategoryDescription) {
		this.subcategoryDescription = subcategoryDescription;
	}

	public ItemCategory getCategory() {
		return category;
	}

	public void setCategory(ItemCategory category) {
		this.category = category;
	}

	public int getActive() {
		return active;
	}

	public void setActive(int active) {
		this.active = active;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@Override
	public String toString() {
		return "Subcategory [subcategoryId=" + subcategoryId + ", subcategoryName=" + subcategoryName
				+ ", subcategoryDescription=" + subcategoryDescription + ", category=" + category + ", active=" + active
				+ "]";
	}
}
