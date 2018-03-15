app.constant('UI_MENU',{
	menu : 'MENU',
	cat : 'CATEGORY',
	order : 'ORDER',
	total : 'Tot',
	id : 'Id',
	name : 'Name',
	price : 'Price',
	parcel : 'Pcl',
	cost : 'Cost',
	quantity : 'Quan',
	no_order_msg : 'Ordered items of present customer will be displayed here',
	item_add:{
		title:'Add item',
		id: 'Item id',
		name:'Item name',
		category :'Item category',
		price:'Price'
	},
	order_bill:{
		title:'Confirm Order',
		items:'ITEMS',
		payment:'Payment by'
	},
	split_payment:{
		title:'Split Payment',
		total:"Total"
	},
	order_item:{
		title:"Order Item",
		quantity:'Quantity',
		parcel:'Parcel'
	}
});

app.constant('UI_PENDING_ORDERS',{
	title : "ORDERS",
	name : "Name",
	date : "Date"
});

app.constant('UI_MATERIAL',{
	materials : 'MATERIALS',
	total : 'Tot',
	id : 'Id',
	name :'Name',
	category : 'Category',
	quan_type : 'Quan type',
	cost : 'Cost',
	order : 'ORDER',
	quantity : 'Quantity',
	no_order_msg : 'Ordered materials will be displayed here',
	material_add:{
		title:'Add Material',
		mat_name:'Material Name',
		mat_category:'Material category',
		mat_type:'Material Type',
		quan_type:'Quantity Type',
		pack_cost:'Pack cost',
		sel_mat_category:"Select Material category",
		sel_mat_type:'Select Material type',
		sel_quan_type:'Select Quan type'
	},
	order_material:{
		title:'Order Material',
		quantity:'Quantity',
		cost:'Cost'
	},
	material_order:{
		title:'Submit Order',
		date:'Date',
		method:'Payment method',
		bill:'Bill',
		amount:"Amount",
		vendor:"Vendor",
		sel_vendor:"Select Vendor",
		direct:"Direct"
	}
});

app.constant('UI_LOGIN',{
	username : 'User name',
	password : 'Password',
	login : 'LOGIN'
});

app.constant('UI_DASHBOARD',{
	title : "BALANCE SUMMARY",
	total : "TOTAL"
});

app.constant('UI_CREDITS',{
	credit:'Sales',
	receipts : 'Receipts',
	categories : "CATEGORIES",
	items : 'ITEMS',
	no_items_msg : 'Items wise data will be shown here',
	no_category_msg : 'Categories wise data will be shown here',
	no_order_msg : 'Order wise data will be shown here',
	orders : {
		title : 'ORDERS',
		id : 'Id',
		date : 'Date',
		user : 'User',
		amount : 'Amount'
	},
	item_det:{
		title : 'ORDER',
		items : 'ITEMS',
		payments : 'PAYMENTS',
		name : 'Name',
		quantity : 'Quantity',
		parcel : 'Parcel',
		amount : 'Amount'
	}
});

app.constant('UI_SUBSTORE_ORDERS',{
	no_order_msg : 'Order wise data will be shown here',
	orders : {
		title : 'ORDERS',
		id : 'Id',
		date : 'Date',
		user : 'User',
		amount : 'Amount',
		status : 'Status',
		store : 'Store'
	},
	item_det:{
		title : 'ORDER',
		items : 'ITEMS',
		payments : 'PAYMENTS',
		name : 'Name',
		quantity : 'Quantity',
		parcel : 'Parcel',
		amount : 'Amount'
	}
});

app.constant('UI_VENDOR',{
	no_order_msg : 'Order wise data will be shown here',
	orders : {
		title : 'ORDERS',
		id : 'Id',
		date : 'Date',
		user : 'User',
		store : 'Store',
		vendor : 'Vendor',
		amount : 'Amount',
		status : 'Status'
	},
	mat_det:{
		title : 'ORDER',
		items : 'ITEMS',
		materials : 'MATERIALS',
		payments : 'PAYMENTS',
		name : 'Name',
		quantity : 'Quan',
		parcel : 'Parcel',
		amount : 'Amount',
		cost : 'Cost',
		delivered_quantity : "Delivered quan",
		actual_cost : "Actual cost"
	}
});

app.constant('UI_DEBITS',{
	debit:'Purchase',
	bills : 'BILLS',
	categories : "CATEGORIES",
	materials : 'MATERIALS',
	no_materials_msg : 'Materials wise data will be shown here',
	no_category_msg : 'Categories wise data will be shown here',
	no_order_msg : 'Order wise data will be shown here',
	orders : {
		title : 'ORDERS',
		id : 'Id',
		date : 'Date',
		user : 'User',
		amount : 'Amount'
	},
	mat_det:{
		title : 'ORDER',
		materials : 'MATERIALS',
		payments : 'PAYMENTS',
		name : 'Name',
		quantity : 'Quantity',
		cost : 'Cost',
		amount : 'Amount',
		delivered_quantity : "Delivered quantity",
		actual_cost : "Actual cost"
	}
});

app.constant('UI_DAY_CLOSE',{	
	title:"DAY CLOSE",
	exp:'Total Exp',
	ccleft:'Counter Cash',
	receiver:'Receiver',
	sel_recei:'Select Receiver',
	status:'Status',
	no_close_info:'Today both sale and purchase not happen. So cannot do day close.'
});

app.constant('UI_DAY_CLOSE_INFO',{
	info : "DAY CLOSE INFO",
	no_daily_info_msg : "Day close info of selected dates will be shown here.",
	receiver : "Receiver",
	credit : "Sale",
	debit : "Exp",
	counter_cash : "CC",
	date : "Date",
	disturbance : "Diff",
	status : "Status",
	day_close_info:{
		title:'Payment',
		type:'Type',
		amount:'Amount',
		credit:'Sale',
		debit:'Expenses',
		counter_cash:'Counter cash',
		disturbance : 'Disturbance'
	}
});

app.constant('UI_INVESTMENT',{	
	title:"INVESTMENT INFO",
	receiver:'Receiver',
	sel_recei:'Select Receiver',
	status:'Status',
	user : 'User',
	amount : 'Amount',
	date : "Date",
	info : "INVESTMENT INFO",
	no_inv_info_msg : "Investment info of selected dates will be shown here.",
	add_investment:{
		title:'Investment',
		date:'Date',
		amount:'Amount',
		receiver:'Receiver',
		sel_receiver:'Select Receiver'
	},
	investment_info:{
		title:'Payment',
		type:'Type',
		amount:'Amount'
	}
});

app.constant('UI_TRANSACTION',{	
	title:"TRANSACTIONS",
	receiver:'Receiver',
	sel_recei:'Select Receiver',
	status:'Status',
	user : 'User',
	amount : 'Amount',
	date : "Date",
	info : "TRANSACTIONS",
	store : "Store",
	no_info_msg : "Transactions info of selected dates will be shown here.",
	add_payment:{
		title:'Payment Info',
		date:'Date',
		amount:'Amount',
		receiver:'Receiver',
		sel_receiver:'Select Receiver'
	},
	payment_info:{
		title:'Payment',
		type:'Type',
		amount:'Amount'
	}
});

app.constant('UI_BALANCE_SHEET',{
	title : "BALANCE SHEET",
	no_balance_info_msg : "Balance sheet info of selected dates will be shown here.",
	date : "Date",
	credit : "Credit",
	debit : "Debit",
	profit : "Profit",
	loss : "Loss",
	amount : "Amount",
	desc : "Description",
	ptype : "Payment",
	payment_det:{
		title : 'PAYMENT Types',
		payments : 'PAYMENTS',
		name : 'Name',
		amount : 'Amount'
	}
});

app.constant('UI_ADMIN_PANEL',{
	users:'USERS',
	stores:'STORES',
	id:'Id',
	name:'Name',
	role:'Role',
	location:'Location',
	store_add:{
		title:'Add Store',
		id:'Store id',
		name:'Store Name',
		location:'Location'
	}
});

app.constant('UI_MANAGE_USER',{
	users:'USERS',
	id:'Id',
	name:'Name',
	role:'Role',
	location:'Location',
	user_add:{
		title:'Add User',
		existing:'Existing',
		newu:'New',
		name:'User Name',
		role:'Role',
		user:'User',
		sel_role:'Select Role',
		sel_user:'Select User',
		location:'location',
		address:'address',
		phone:'phone'
	}
});

app.constant('UI_PROFILE',{
	change_password:{
		title:'CHANGE PASSWORD',
		old_pass:'Old Password',
		new_pass:'New Password',
		conf_pass:'Confirm New Password',
		submit:'SUBMIT'
	}
})