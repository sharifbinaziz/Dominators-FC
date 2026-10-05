DOMINATORS FC — SECURE ADMIN (NO STORAGE)

This version uses:
- Firebase Authentication for admin login/password
- Firestore for website content
- Firebase Security Rules to protect edits
- NO Firebase Storage

1) ENABLE FIREBASE AUTHENTICATION
Firebase Console -> Project: dominatorsfcbd -> Authentication -> Sign-in method -> Email/Password -> Enable.
Do NOT enable public Email/Password sign-up for this admin-only site.

2) CREATE YOUR ADMIN ACCOUNT
Firebase Console -> Authentication -> Users -> Add user.
Enter the email and password you want to use for /admin.html.
The password is managed by Firebase Authentication and is not stored in Firestore.

3) FIRESTORE ADMIN ROLE
After creating your Firebase Auth user, copy its UID and create:  
  Collection: admins
  Document ID: YOUR_FIREBASE_AUTH_UID
  Field: role = admin
Do not create admin records for ordinary users.

4) DEPLOY
From the project folder:
  firebase login
  firebase use dominatorsfcbd
  firebase deploy --only hosting,firestore:rules

5) USE ADMIN
Open /admin.html and sign in.
You can edit text, add/delete/reorder cards, and change image paths/URLs from phone or PC.

PHOTO MANAGEMENT
Firebase Storage has intentionally been removed. The admin does NOT upload files.
For images, enter a path such as images/player.jpg for an image already included in the website files, or enter a public HTTPS image URL.
To add a new local photo, place the photo inside the website's images folder, deploy the website, then enter its path in Admin.

IMPORTANT
The old Firestore password document is not used. Firebase Authentication handles the admin password.


LIVE SITE
https://dominatorsfcbd.web.app/
Developer credit: https://sharifbinaziz.web.app/
