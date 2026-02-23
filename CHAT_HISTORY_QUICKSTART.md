# Chat History System - Quick Start Guide

## What's New?

Your AI Reports Dashboard now has a complete chat history system with:
- 💾 **Database Storage** - Chats sync across all your devices
- 🔍 **Search** - Find old conversations instantly
- 🗑️ **Delete** - Remove unwanted chats
- 📦 **Archive** - Keep old chats organized
- 💬 **Full History** - Complete conversation messages preserved

## How to Use

### Starting a New Chat
1. Click the "AI Assistant" button (bottom right)
2. Type your question and press Enter
3. Chat automatically saves to database
4. Continue conversation - all messages save automatically

### Finding Old Chats
1. Open AI Assistant
2. Look at "Recent Chats" panel on the left (desktop) or top (mobile)
3. Use the search box to find specific chats
4. Click any chat to load complete conversation history

### Managing Chats
1. Hover over any chat in the recent chats list
2. Two icons appear on the right:
   - **Archive icon** (📦) - Archive the chat (keeps it but hides from main list)
   - **Trash icon** (🗑️) - Delete permanently (asks for confirmation)

### Multi-Device Sync
- Chats automatically sync across all your devices
- Start conversation on desktop, continue on mobile
- All messages preserved in database

## Setup Required

### Backend
1. **Restart server** for new endpoints:
   ```powershell
   cd server
   npm run dev
   ```

2. **Verify endpoints** (should see in server logs):
   - POST /api/chats
   - GET /api/chats
   - PUT /api/chats/:chatId
   - DELETE /api/chats/:chatId
   - And more...

### Frontend
1. **Restart client** to load new components:
   ```powershell
   cd client
   npm run dev
   ```

2. **Test the system**:
   - Open AI Reports Dashboard
   - Click AI Assistant button
   - Send a test message
   - Check browser console for any errors
   - Refresh page and verify chat persists

## Troubleshooting

### Chats not saving?
- Check browser console (F12) for errors
- Verify you're logged in
- Make sure server is running
- Check backend logs for database errors

### Chats not loading?
- Refresh the page
- Check authentication (try logging out and back in)
- Verify MongoDB connection in server logs

### Search not working?
- Make sure you have some chats created first
- Search is case-insensitive
- Searches both title and message content

### Delete/Archive buttons not showing?
- Hover over the chat item
- Icons appear on the right side when hovering
- On active chat, icons are always visible

## Technical Details

**Backend**: MongoDB stores chats with userId and shopId for security  
**Frontend**: React state management with auto-save on every message  
**API**: RESTful endpoints with authentication required  
**Security**: Users can only access their own chats  

See `CHAT_HISTORY_SYSTEM.md` for complete technical documentation.

## What Changed?

### Before (localStorage)
- Chats only stored in browser
- Lost when clearing browser data
- No sync between devices
- Limited to 10 recent chats
- Only preview text saved

### After (Database)
- Chats stored in MongoDB
- Persistent and secure
- Syncs across all devices
- Unlimited chat history
- Complete conversation messages

## Next Steps

1. ✅ Restart both server and client
2. ✅ Test creating a chat
3. ✅ Test searching for chats
4. ✅ Test delete functionality
5. ✅ Test on different device (multi-device sync)
6. ✅ Verify chat persists after page refresh

## Support

If you encounter issues:
1. Check browser console (F12) for frontend errors
2. Check server terminal for backend errors
3. Verify MongoDB is running and connected
4. Review `CHAT_HISTORY_SYSTEM.md` for detailed troubleshooting

---

**Note**: Old chats in localStorage will not automatically migrate. They remain in browser but new chats will save to database.
