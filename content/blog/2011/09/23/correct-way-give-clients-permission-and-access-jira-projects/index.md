---
title: "The correct way to give clients permission and access to Jira projects"
date: "2011-09-23T12:28:00.000Z"
tags: ["jira", "pm"]
---

Jira is a totally wonderful piece of project management software, especially when coupled with the GreenHopper extension which greatly assists in Agile Development. That said, it's totally meant for programmers - so much so, that it requires a programmer to setup client access to specific projects. Jira's own documentation is pretty weak when it comes to setting up clients with access to one (or more) project.

If you take it from a very high level though, it is very simple to set this up. First, you want to create a new Project Role by going to Administration > Users, Groups & Roles > Project Role Browser, then under Add Project Role: type "Clients" in the Name field, type "A project role that represents clients in a project" in the Description field, then click Add Project Role. This is the role that is defined for clients in Jira.</p><p>After a role is defined, you need to edit the Permission Scheme to accommodate the new Client role by going to Administration > Schemes > Permission Schemes. Click the Permissions link next to Default Permission Scheme in the Operations column. Click the Grant Permission link near the top of the page, select the Permissions you wish to grant to client users, then select Clients from the Project Role select dropdown menu and click Add. You then want to repeat the process for the Project Role: Developers. The Permissions that you typically want to setup with this are:

- Browse Projects
- Create Issues
- Assign Issues
- Assignable User
- Close Issues
- Add Comments
- Edit Own Comments
- Delete Own Comments
- Create Attachments
- Delete Own Attachments

You then want to remove all of the permissions for Project Role: User as these permissions will be replaced with ones from the Clients/Developers access we just setup.

Your final step is to setup the user by going to Administration > Users, Groups & Roles > User Browser, then click Add User. Fill in the appropriate info then click Create to create the new client user. After the user is created and you are at the User Browser window, click the Project Roles link next to the client user account you just setup, then click Edit Project Roles. Click the checkbox in the Clients column next to the one or many projects this client should have client access to, then click Save.

Hopefully this clarified how Jira works with user accounts, permissions and roles and gets you on your way to giving out Jira access to your clients.
