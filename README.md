# Gini Core

# API Reference

This document provides the API reference for the Gini core that includes QiServices Mini Apps JavaScript SDK and Aqsati integration. It details available methods, their signatures, parameters, and callback types for interacting with QiServices platform features, including payments, account information, utility functions, and the new BNPL (Aqsati) functionality.

---

## Table of Contents

1. **Utility**
   - qi.close() - Closes the Mini App.
   - qi.isMiniApp() - Returns true if the web page is running inside the QiServices Mini App Platform.

2. **Financial**
   - qi.purchase() - Shows a popup to the user to carry out a purchase operation.
   - qi.getAccount() - Shows a popup to the user to select the account to be shared with the Mini App.
   - qi.aqsati.initiateOTP() - Initiates the BNPL (Aqsati) flow by sending an OTP to the user after account selection.
   - qi.aqsati.confirmAmount() - Confirms the BNPL (Aqsati) transaction after OTP verification.

3. **Functionality**
   - qi.readQr() - Opens the camera to scan a QR code and returns the raw value of the QR code.
   - qi.openURL() - Opens a URL in the browser or internally inside the QiServices App.
   - qi.getLocation() - Returns the user's current location (if permission is granted and the device has location services enabled).
  
4. **Authentication**
   - Get Phone Number from Token.
   - Get Account Number from Token.




### Utility

#### qi.isMiniApp()
Returns true if the web page is running inside the QiServices Mini App Platform.

**Signature:**
```typescript
isMiniApp: () => boolean
```


**Input Params:** None

**Callback Type:** None

---

#### qi.close()
Closes the Mini App.

**Signature:**
```typescript
close: () => void
```

---

## API Reference

### Authentication Flow

<details>
    <summary>Click to view the Auth Flow Diagram</summary>
   
![Auth Flow](auth-sequence.png)
</details>

### Financial

#### qi.getAccount()
Shows a popup to the user to select the account to be shared with the Mini App.

**Signature:**
```typescript
getAccount: (callback: (result: AccountResult) => void) => void
```


**Input Params:** None

**Callback Type:**
```typescript
{
  status: "'SUCCESSFUL' | 'CANCELLED'",
  account: SignedField<string>
}
```

<details>
    <summary>Click to view the Get Account Flow Diagram</summary>

![Get Accounts Flow](aqsati-sequence.png)
</details>

---

#### qi.purchase()
Shows a popup to the user to carry out a purchase operation. Check the purchase flow in purchase-flow.md for more details.

**Signature:**
```typescript
purchase: (options: PurchaseOptions, callback: (result: PurchaseResult) => void) => void
```


**Input:**
```typescript

{
  price: number;
  merchantTransactionID: string;
}
```


**Callback Type:**
```typescript
{
  status: "'SUCCESSFUL' | 'CANCELLED' | 'FAILED'",
  transactionID: string;
  RRN?: string;
}
```


---

#### qi.aqsati.initiateOTP()
Initiates the BNPL (Aqsati) flow by sending an OTP to the user after selecting an account from QiService or SuperQi.

**Signature:**
```typescript
initiateOTP: (options: AqsatiInitiateOptions, callback: (result: AqsatiInitiateResult) => void) => void
```


**Input:**
```typescript
{
  accountID: string; // Selected account ID from qi.getAccount()
  amount: number; // Transaction amount
}
```


**Callback Type:**
```typescript
{
  status: "'OTP_SENT' | 'CANCELLED' | 'FAILED'",
  transactionID: string; // Unique transaction ID for the BNPL flow
}
```


---

#### qi.aqsati.confirmAmount()
Confirms the BNPL (Aqsati) transaction after the user enters the OTP.

**Signature:**
```typescript
confirmAmount: (options: AqsatiConfirmOptions, callback: (result: AqsatiConfirmResult) => void) => void
```


**Input:**
```typescript
{
  transactionID: string; // Transaction ID from qi.aqsati.initiateOTP()
  otp: string; // OTP entered by the user
}
```


**Callback Type:**
```typescript
{
  status: "'SUCCESSFUL' | 'CANCELLED' | 'FAILED'",
  transactionID: string; // Confirmed transaction ID
  RRN?: string; // Retrieval Reference Number (if applicable)
}
```


---


### Functionality

#### qi.readQr()
Opens the camera to scan a QR code and returns the raw value of the QR code.

**Signature:**
```typescript
readQr: (callback: (result: QRResult) => void) => void
```

**Input Params:** None

**Callback Type:**
```typescript
{
  status: "'SUCCESSFUL' | 'CANCELLED'",
  value: string;
}
```


---

#### qi.getLocation()
Returns the user's current location (if permission is granted and the device has location services enabled).

**Signature:**
```typescript
getLocation: (callback: (result: LocationResult) => void) => void
```

**Input Params:** None

**Callback Type:**
```typescript
{
  status: "'SUCCESSFUL' | 'CANCELLED' | 'REJECTED'",
  longitude?: number;
  latitude?: number;
  accuracy?: number;
}
```


---

#### qi.openURL()
Opens a URL in the browser or internally inside the QiServices App.

**Signature:**
```typescript
openURL: (options: OpenURLOptions, callback: (result: OpenURLResult) => void) => void
```

**Input Params:**
```typescript
{
  url: string;
  type: "EXTERNAL" | "INTERNAL";
}
```

**Callback Type:**
```typescript
{
  url: string;
  status: "APP_CLOSE" | "USER_CLOSE" | "IMMEDIATE_CLOSE";
}
```


### Authentication

#### Retrieve Phone Number by token
Retrieve the phone number associated with the provided authentication token.

**URL**

/v1.0/giniidentity/qi-services/get-phone

**Result**
```typescript
{
"data":{"phone":"+96412332112"}
}
```

**Input Params:** 
```typescript
{
  "token": "<string>"
}
```


---

#### Account Number by token
Opens the camera to scan a QR code and returns the raw value of the QR code.

**URL**

/v1.0/giniidentity/qi-services/get-account

**Result**
```typescript
{
"data":{"account":"123456789"}
}
```

**Input Params:** 
```typescript
{
  "token": "<string>"
}
```

---

