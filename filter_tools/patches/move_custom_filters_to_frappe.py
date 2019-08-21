import json

import frappe


def execute():
	list_filters = frappe.get_all("Custom Listview Filter")

	for old_filter in list_filters:
		old_filter_doc = frappe.get_doc("Custom Listview Filter", old_filter.name)

		filter_name = old_filter_doc.label
		reference_doctype = old_filter_doc.filter_doctype
		for_user = old_filter_doc.user_id
		filters = []

		for f in old_filter_doc.filter_list:
			# handle doctype rename
			if f.filter_dt == "Production Order":
				f.filter_dt = "Work Order"

			new_filter = [f.filter_dt or reference_doctype, f.filter_fieldname, f.filter_condition]

			if f.filter_value2:
				new_filter.append([f.filter_value, f.filter_value2])
			else:
				new_filter.append(f.filter_value)

			new_filter.append(False)  # Frappe is expecting a "hidden" field in the filter
			filters.append(new_filter)

		new_filter_doc = frappe.new_doc("List Filter")
		new_filter_doc.update({
			"filter_name": filter_name,
			"reference_doctype": reference_doctype,
			"for_user": for_user,
			"filters": json.dumps(filters)
		})
		new_filter_doc.insert()
