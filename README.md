# gini-core

# QiServices Mini Apps JavaScript SDK API Reference

This document provides the API reference for the QiServices Mini Apps JavaScript SDK. It details available methods, their signatures, parameters, and callback types for interacting with QiServices platform features, including payments, account information, utility functions, and the new BNPL (Aqsati) functionality.

---

## Table of Contents

1. [Financial APIs](#financial-apis)
   - [`qi.purchase()`](#qipurchase)
   - [`qi.getAccount()`](#qigetaccount)
   - BNPL (Aqsati):
     - [`qi.aqsati.initiateOTP()`](#qiaqsatiinitiateotp)
     - [`qi.aqsati.confirmAmount()`](#qiaqsaticonfirmamount)

2. [Functionality APIs](#functionality-apis)
   - [`qi.readQr()`](#qireadqr)
   - [`qi.openURL()`](#qiopenurl)
   - [`qi.getLocation()`](#qigetlocation)

3. [Utility APIs](#utility-apis)
   - [`qi.close()`](#qiclose)
   - [`qi.isMiniApp()`](#qiisminiapp)

---

## Financial APIs

### `qi.getAccount()`
Shows a popup to the user to select the account to be shared with the Mini App.

**Signature:**
```typescript
getAccount: (callback: (result: AccountResult) => void) => void
