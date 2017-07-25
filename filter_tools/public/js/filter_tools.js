frappe.provide("filter_tools.ui");

filter_tools.ui.render = function() {
	// hacky way of injecting a widget on the sidebar
  // 1) we wait on a body page-change event to trigger this code
	// 2) see if the current page is a list view by parsing data-route on body
	// 3) see if sidebar has our container, if not create it
	// 4) call backend to get list of stored filters for this doctype
	// 5) render filters and make clickable to first clear then set stored filters
	// 6) when a listview refreshes, there are no dom events to hook into so we
	//    wrapped the set_sidebar_height function to reinject our widget since
	//    the sidebar height is always recalculated after rendering.

	var has_sidebar = $("body").attr("data-sidebar");
	var route = $("body").attr("data-route");

	if ( route ) {
		// route is made from <type>/<id>
		// in our case type is List and id is the Doctype
		var parts = route.split('/');
		var page_type = parts[0];
		var doctype = parts[1];

		// we only care about Listviews
		if ( page_type == "List" ) {
			// get a ref to the page container
			// all pages id are set like "page-<route>"
			var $page = $('[id="page-'+route+'"');
			// and sidebar
			var $sidebar = $page.find('.layout-side-section .overlay-sidebar');

			var $filter_tools = $sidebar.find('.filter-tools');
			// if our filter tools aren't there, then inject the container
			if ( $filter_tools.length == 0 ) {
				$filter_tools = $('<ul class="filter-tools list-unstyled sidebar-menu"></ul>')
				$sidebar.find('ul.sidebar-stat').before($filter_tools);
			}

			// modify sidebar set height to re-inject our widget
			if ( !cur_list.set_sidebar_height.__filter_tools_added ) {
				(function() { // scope isolation to keep internal scope safe of var changes
					var org_set_sidebar_height = cur_list.set_sidebar_height;
					cur_list.set_sidebar_height = function() {
						// call original code
						org_set_sidebar_height.call(cur_list);
						// render our widget again
						filter_tools.ui.render();
					};
					cur_list.set_sidebar_height.__filter_tools_added = 1;
			  }());
			}

			var refresh_filter_tools = function(freeze) {
				if ( freeze === undefined ) {
					freeze = 0;
				}

				frappe.call({
					method: "filter_tools.filters.get_filters",
					args: {
						dt: doctype
					},
					freeze: freeze,
					callback: function(r) {
						var filters = []
						if ( r.message == "Success" ) {
							filters = r.docs;
						}

						// cache filters by name to quickly find them
						var filter_cache = {}
						for(var i = 0; i < filters.length; i++) {
							filter_cache[filters[i].name] = filters[i];
						}

						// inject our widget template
						$filter_tools.empty().append(frappe.render(frappe.templates.filter_tools, {
							options: {
								is_global: true
							},
							filters: filters
						}));

						// hide options by default
						var $options = $filter_tools.find('.options').hide();

						// only show options when the filter name is entered
						$filter_tools.find('.filter-name').keyup(function() {
							if ( $(this).val() ) {
								$options.slideDown('fast');
							} else {
								$options.slideUp('fast');
							}
						}).change(function() {
							if ( $(this).val() ) {
								$options.slideDown('fast');
							} else {
								$options.slideUp('fast');
							}
						})

						// handle stored filter click
						$filter_tools.find('.filter-link').click(function() {
								var $filter_container = $(this).parent();
								var name = $filter_container.attr('data-name');
								var filter = filter_cache[name];

								if ( filter ) {
									cur_list.filter_list.clear_filters();
									for(var i = 0; i < filter.filter_list.length; i++) {
										var f = filter.filter_list[i];
										cur_list.filter_list.add_filter(doctype, f.filter_fieldname, f.filter_condition, f.filter_value);
									}
								}

								cur_list.refresh(true);
						});

						// handle remove button
						$filter_tools.find('.filter-remove').click(function() {
							var $filter_container = $(this).parent();
							var name = $filter_container.attr('data-name');
							var filter = filter_cache[name];

							if ( filter ) {
								frappe.call({
									method: "filter_tools.filters.remove",
									args: {
										name: name
									},
									freeze: 1,
									callback: function() {
										// re-render filter list now with new item
										refresh_filter_tools(1);
									}
								})
							}
						});

						// handle save button click
						$filter_tools.find('a.save-filter').click(function() {
							var label = $filter_tools.find('.filter-name').val();
							var filters =  cur_list.filter_list.get_filters();

							if ( filters.length == 0 ) {
								frappe.msgprint("There are no filters to store");
								return;
							}

							var data = [];

							$.each(filters, function(i, filter) {
								var fieldname = filter[1];
								var condition = filter[2];
								var value = filter[3];
								data.push({
									filter_condition: condition,
									filter_fieldname: fieldname,
									filter_value: value
								});
							});

							// get is global option if checked
							var is_global = $filter_tools.find('.options input[name="is_global"]').is(':checked');

							var args = {
								label: label,
								filter_doctype: doctype,
								filter_list: data
							}

							if ( !is_global ) {
								args.user = frappe.user.name;
							}

							frappe.call({
								method: "filter_tools.filters.add",
								args: args,
								freeze: 1,
								callback: function() {
									// re-render filter list now with new item
									refresh_filter_tools(1);
								}
							})

						});

					}
				})
			};

			// kick off fetching filters
			refresh_filter_tools();
		}
	}
}


$(document).on("page-change", function() {
	setTimeout(function() { // wait a cycle to make sure sidebar gets generated
		filter_tools.ui.render();
	}, 100);
});
