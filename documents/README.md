# BiteClub Project: Test Credentials & SRS Deviation(s)

## Test Accounts

Use these credentials to log in and test different user roles in the BiteClub application:

### General User

- **Username:** general_user@email.com
- **Password:** vifectracti

### Business User

- **Username:** business_user@email.com
- **Password:** vifectracti

### Admin User

- **Username:** admin_user@email.com
- **Password:** vifectracti

## SRS Deviation(s)

There was one significant deviation from the SRS as outlined below:

**Deviation #001:**

- _Description:_ As stated in Sections 2.3 Project Scope and 2.6 Functional Requirements of the SRS, reservations and pre-ordering features were initially proposed. However, due to time constraints, uncertainty about whether these features aligned with target user needs, and concerns that expanding the feature set too broadly could dilute the focus of our solution, the team decided to make them optional. This change was approved by the professor after consultation. The omission of reservations and pre-ordering features required us to adjust the points redemption process. Instead of applying discounts directly at checkout, users now redeem their points on a dedicated “Redeem Points” page by generating coupon codes. These discounts become available to the general user only after business users (restaurant owners) accept the coupon codes on their profile.
