# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "filter_tools"
app_title = "Filter Tools"
app_publisher = "DigiThinkIT, Inc."
app_description = "Listview filter utility tools."
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "forellana@digithinkit.com"
app_license = "MIT"

app_include_css = "/assets/css/filter_tools.css"
app_include_js = "/assets/js/filter_tools.js"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/filter_tools/css/filter_tools.css"
# app_include_js = "/assets/filter_tools/js/filter_tools.js"

# include js, css files in header of web template
# web_include_css = "/assets/filter_tools/css/filter_tools.css"
# web_include_js = "/assets/filter_tools/js/filter_tools.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "filter_tools.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "filter_tools.install.before_install"
# after_install = "filter_tools.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "filter_tools.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"filter_tools.tasks.all"
# 	],
# 	"daily": [
# 		"filter_tools.tasks.daily"
# 	],
# 	"hourly": [
# 		"filter_tools.tasks.hourly"
# 	],
# 	"weekly": [
# 		"filter_tools.tasks.weekly"
# 	]
# 	"monthly": [
# 		"filter_tools.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "filter_tools.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "filter_tools.event.get_events"
# }
