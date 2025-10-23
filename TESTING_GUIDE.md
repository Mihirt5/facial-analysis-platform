# UploadThing & HEIC Photo Support - Testing Guide

## 🧪 **How to Test UploadThing & HEIC Support**

### **1. Local Testing (Development)**

#### **Step 1: Start the Development Server**
```bash
cd /Users/mihirthaha/Parallel
pnpm dev
```
Server should start at `http://localhost:3000`

#### **Step 2: Test UploadThing Endpoint**
```bash
# Test UploadThing endpoint (should return 500 when not authenticated - this is expected)
curl -X POST http://localhost:3000/api/uploadthing \
  -H "Content-Type: application/json" \
  -d '{"actionType":"upload","slug":"imageUploader"}' \
  -v
```

#### **Step 3: Test in Browser**
1. **Open**: `http://localhost:3000/mobile/onboarding`
2. **Login**: Use Google OAuth to authenticate
3. **Navigate to**: `/create-analysis` page
4. **Test Uploads**:
   - **Standard Images**: Try uploading JPG, PNG, GIF, WebP files
   - **HEIC Images**: Try uploading iPhone photos (.heic files)
   - **File Size**: Test files up to 4MB
   - **Multiple Files**: Test uploading different image types

#### **Step 4: Check Console Logs**
Look for these success messages in browser console:
```
Upload started: filename.jpg
Upload successful: [{url: "...", key: "..."}]
```

#### **Step 5: Test Analysis Creation**
After uploading all 6 required photos:
1. Click "Submit" button
2. Should see successful analysis creation
3. Should redirect to `/analysis` page

### **2. Production Testing**

#### **Step 1: Deploy Latest Changes**
```bash
git add .
git commit -m "Fix database schema and UploadThing configuration"
git push origin main
```

#### **Step 2: Test Production Site**
1. **Open**: `https://parallellabs.co/mobile/onboarding`
2. **Login**: Use Google OAuth
3. **Test Uploads**: Same as local testing
4. **Check UploadThing Dashboard**: Verify uploads appear in your UploadThing dashboard

### **3. Specific Test Cases**

#### **Test Case 1: Standard Image Uploads**
- **Files**: JPG, PNG, GIF, WebP
- **Expected**: Upload successful, image preview shows
- **Console**: "Upload successful" message

#### **Test Case 2: HEIC Image Uploads**
- **Files**: iPhone photos (.heic, .heif)
- **Expected**: Upload successful, image preview shows
- **Console**: "Upload successful" message

#### **Test Case 3: File Size Limits**
- **Files**: Images > 4MB
- **Expected**: Upload rejected with error message
- **Console**: "Upload error" message

#### **Test Case 4: Multiple File Types**
- **Files**: Mix of JPG, PNG, HEIC files
- **Expected**: All upload successfully
- **Console**: Multiple "Upload successful" messages

#### **Test Case 5: Analysis Creation**
- **Prerequisites**: All 6 photos uploaded
- **Action**: Click "Submit" button
- **Expected**: Analysis created successfully, redirect to analysis page
- **Console**: No errors, successful mutation

### **4. Troubleshooting**

#### **If Uploads Fail**
1. **Check Environment Variables**:
   ```bash
   echo $UPLOADTHING_TOKEN
   echo $UPLOADTHING_APP_ID
   echo $NEXT_PUBLIC_UPLOADTHING_APP_ID
   ```

2. **Check UploadThing Dashboard**: Verify files appear in your UploadThing dashboard

3. **Check Browser Console**: Look for specific error messages

#### **If Analysis Creation Fails**
1. **Check Database Schema**:
   ```bash
   pnpm db:push --force
   ```

2. **Check Server Logs**: Look for database errors in terminal

3. **Check Browser Console**: Look for tRPC mutation errors

#### **If HEIC Files Don't Work**
1. **Verify File Format**: Ensure files are actually HEIC format
2. **Check File Input**: Verify `accept="image/*,.heic,.heif"` is present
3. **Test with Different HEIC Files**: Try multiple iPhone photos

### **5. Success Indicators**

#### **✅ UploadThing Working**
- Files upload successfully
- "Upload successful" console messages
- Images appear in UploadThing dashboard
- Image previews show in UI

#### **✅ HEIC Support Working**
- iPhone photos upload successfully
- No conversion needed
- Original quality maintained
- File input accepts HEIC files

#### **✅ Analysis Creation Working**
- All 6 photos uploaded
- "Submit" button works
- Analysis created successfully
- Redirect to analysis page

### **6. Production Deployment Checklist**

#### **Environment Variables**
- [ ] `UPLOADTHING_TOKEN` set in production
- [ ] `UPLOADTHING_APP_ID` set in production
- [ ] `NEXT_PUBLIC_UPLOADTHING_APP_ID` set in production

#### **Code Changes**
- [ ] HEIC support added to UploadThing configuration
- [ ] File input accepts HEIC files
- [ ] Environment variables synchronized
- [ ] Database schema updated

#### **Testing**
- [ ] Local testing successful
- [ ] Production deployment successful
- [ ] UploadThing dashboard shows uploads
- [ ] Analysis creation works end-to-end

## 🎯 **Quick Test Commands**

```bash
# Test UploadThing endpoint
curl -X POST http://localhost:3000/api/uploadthing \
  -H "Content-Type: application/json" \
  -d '{"actionType":"upload","slug":"imageUploader"}' \
  -v

# Check environment variables
grep -i upload .env

# Sync database schema
pnpm db:push --force

# Test production build
pnpm build

# Deploy to production
git add . && git commit -m "Test UploadThing and HEIC support" && git push origin main
```

## 📱 **iPhone Testing**

1. **Take Photos**: Use iPhone camera to take photos
2. **Upload**: Try uploading directly from iPhone
3. **Verify**: Check that HEIC files upload without conversion
4. **Quality**: Ensure original photo quality is maintained

The UploadThing integration with HEIC support should now work perfectly!
