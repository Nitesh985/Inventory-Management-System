# Quick Fix Guide - AI Assistant Errors

## 🔴 Problem: "Sorry, I encountered an error analyzing your data"

### **Immediate Solutions:**

#### **Solution 1: Check Server Logs** (Most Important)
1. Open your server terminal
2. Look for these log messages after asking a question:
   ```
   Analytics chat request received
   Shop ID: [should show an ID]
   Message: [your question]
   Data fetched: { products: X, sales: Y, ... }
   ```

3. **If you see any errors**, they will tell you exactly what's wrong:
   - `Gemini API Error` → API key issue or quota exceeded
   - `Shop authentication required` → Not logged in properly
   - `MongooseError` → Database connection issue

#### **Solution 2: Switch to Ollama (No API Limits)**
Since you already have Ollama phi3:mini installed:

1. **Edit `server/.env`:**
   ```env
   USE_OLLAMA=true
   ```

2. **Make sure Ollama is running:**
   ```bash
   ollama serve
   ```
   (Usually runs automatically)

3. **Restart your server:**
   ```bash
   cd server
   npm run dev
   ```

4. **Test again** - Should work without Gemini API limits!

#### **Solution 3: Fix Authentication**
If error says "Shop authentication required":

1. Log out of your app
2. Clear browser cookies (F12 → Application → Cookies → Clear)
3. Log back in
4. Try AI Assistant again

#### **Solution 4: Check Gemini API**
If using Gemini (not Ollama):

1. Go to: https://aistudio.google.com/app/apikey
2. Check if your API key is valid
3. Check quota usage
4. If quota exceeded → **Use Ollama instead** (see Solution 2)

## 🟢 Testing Your Setup

### **Test 1: Ollama Health Check**
```bash
curl http://localhost:11434/api/tags
```
Should return list of models including `phi3:mini`

### **Test 2: Simple Question**
Ask the AI: `"Hello, can you hear me?"`

If it responds, the system works!

### **Test 3: Data Question**
Ask: `"How many products do I have?"`

This tests database integration.

## 📊 Which AI System Is Active?

Check `server/.env`:
- `USE_OLLAMA=true` → Using Ollama (local, unlimited)
- `USE_OLLAMA=false` → Using Gemini (cloud, API limits)

## 🎯 Recommended Setup

**For Development/Heavy Use:**
```env
USE_OLLAMA=true  # No API limits!
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=phi3:mini
GEMINI_API_KEY=your_key  # Automatic fallback
```

**For Production/Best Quality:**
```env
USE_OLLAMA=false
GEMINI_API_KEY=your_production_key
```

## 🔧 Common Fixes

### "Ollama unavailable, falling back to Gemini"
- Ollama not running → Start with `ollama serve`
- Model not downloaded → Run `ollama pull phi3:mini`
- Port blocked → Check if something else uses port 11434

### "Gemini API Error"
- Invalid API key → Get new one from https://aistudio.google.com/
- Quota exceeded → Use Ollama or wait for quota reset
- Network error → Check internet connection

### "Shop authentication required"
- Session expired → Log out and log back in
- Cookies disabled → Enable cookies in browser
- Multiple accounts → Make sure using correct account

## 📝 Debug Checklist

1. ✅ Server is running (`npm run dev`)
2. ✅ Client is running (`npm run dev`)
3. ✅ Logged into your shop account
4. ✅ Have products/sales in database
5. ✅ Ollama is running (if USE_OLLAMA=true)
6. ✅ Valid Gemini API key (if USE_OLLAMA=false)
7. ✅ Check server terminal for error logs

## 💡 Pro Tips

1. **Always check server logs first** - They tell you exactly what's wrong
2. **Use Ollama for unlimited usage** - No API costs or limits
3. **Gemini for best quality** - Better responses but has limits
4. **System auto-fallbacks** - If Ollama fails, uses Gemini automatically

## 🆘 Still Not Working?

1. Restart both server AND client
2. Clear browser cache completely
3. Check MongoDB connection is working
4. Ensure you have data in your shop (products, sales)
5. Check the detailed server logs for specific errors

---

**Need more help?** Check the full guide: `AI_IMPLEMENTATION_GUIDE.md`
