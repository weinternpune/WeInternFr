# Multiple File Upload Feature for Mentor Assignments

## Summary
Enabled multiple file uploads for mentor assignment creation. Mentors can now attach multiple PDFs, documents, images, and other files when creating assignments.

---

## Changes Made

### 1. Frontend - MentorDashboard.jsx
**Location**: `frontend/src/components/Mentor/MentorDashboard.jsx`

#### Updated AssignmentModal Component:
- **State Change**: Changed from single `attachmentUrl` and `attachmentName` to `attachments` array
  ```javascript
  // Before
  attachmentUrl: '', attachmentName: ''
  
  // After
  attachments: [] // Array of {url: '', name: ''}
  ```

- **File Upload Handler**: Now handles multiple files
  ```javascript
  // Accepts multiple files
  const files = Array.from(e.target.files || []);
  
  // Uploads each file sequentially
  for (const file of files) {
    // Upload logic...
    uploadedFiles.push({ url, name });
  }
  
  // Appends to existing attachments
  update('attachments', [...form.attachments, ...uploadedFiles]);
  ```

- **New Feature**: Added `removeAttachment()` function to delete individual files
- **UI Updates**:
  - Added `multiple` attribute to file input
  - Shows list of uploaded files with remove buttons
  - Updated label text to indicate multiple file support
  - Added file counter and styled file list with green background

- **Submit Handler**: Now sends arrays of URLs and names
  ```javascript
  attachmentUrls: form.attachments.map(a => a.url),
  attachmentNames: form.attachments.map(a => a.name)
  ```

### 2. Backend - Assignment Model
**Location**: `backend/src/models/MentorAssignment.js`

Added new fields to schema:
```javascript
attachmentUrls: [{ type: String }],
attachmentNames: [{ type: String }]
```

### 3. Backend - Mentor Routes
**Location**: `backend/src/routes/mentor.js`

Updated `/assignments` POST route:
```javascript
// Extract arrays from request body
const { attachmentUrls = [], attachmentNames = [] } = req.body;

// Store in assignment
const assignment = await Assignment.create({
  // ... other fields
  attachmentUrls: Array.isArray(attachmentUrls) ? attachmentUrls : [],
  attachmentNames: Array.isArray(attachmentNames) ? attachmentNames : []
});
```

### 4. Student Dashboard - AssignmentsTab.jsx
**Location**: `frontend/src/components/Dashboard/AssignmentsTab.jsx`

Updated assignment detail modal:
- Shows all uploaded files with proper names
- Displays file counter: "📎 Attached Files (3):"
- Each file shown as clickable download link
- Maintained backward compatibility with legacy single attachment

### 5. Student Dashboard - Dashboard.jsx
**Location**: `frontend/src/components/Dashboard/Dashboard.jsx`

Updated assignment card display:
- Shows first 2 attachments in card
- If more than 2 files, shows "+N more file(s)"
- Maintained backward compatibility with legacy single attachment

---

## Features

### For Mentors:
✅ Upload multiple files at once (PDFs, DOC, DOCX, ZIP, PNG, JPG, JPEG)  
✅ See list of all uploaded files with names  
✅ Remove individual files before submitting  
✅ Visual feedback during upload (loading state)  
✅ Success toast showing number of files uploaded  

### For Students:
✅ View all attached files in assignment details  
✅ Download each file individually  
✅ See file names clearly  
✅ File counter shows total attachments  
✅ Quick preview of first 2 files in assignment card  

---

## Backward Compatibility

The system maintains full backward compatibility:
- Existing assignments with single `attachmentUrl` still work
- UI checks for both new array format and legacy single format
- No data migration required
- New assignments use array format automatically

---

## File Upload Flow

1. **Mentor selects multiple files** → Click "Upload Files" button
2. **Frontend uploads each file** → Sequential upload to `/api/mentor/upload`
3. **Backend saves files** → Returns file URL for each
4. **Frontend displays list** → Shows uploaded files with remove option
5. **Mentor submits assignment** → Sends arrays of URLs and names
6. **Backend stores arrays** → Saves to `attachmentUrls` and `attachmentNames`
7. **Students see files** → All attachments visible in dashboard

---

## Technical Details

### File Input
```html
<input 
  type="file" 
  accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg" 
  onChange={handleFileUpload} 
  multiple
  disabled={uploading}
/>
```

### Data Structure
```javascript
// Frontend state
attachments: [
  { url: '/uploads/file1.pdf', name: 'Assignment Brief.pdf' },
  { url: '/uploads/file2.docx', name: 'Instructions.docx' }
]

// Backend database
{
  attachmentUrls: ['/uploads/file1.pdf', '/uploads/file2.docx'],
  attachmentNames: ['Assignment Brief.pdf', 'Instructions.docx']
}
```

---

## Testing Checklist

- [x] Multiple file upload works in Create Assignment modal
- [x] Individual file removal works before submit
- [x] Assignment creation saves all attachments
- [x] Student dashboard shows all attachments
- [x] Assignment detail modal displays all files
- [x] File downloads work correctly
- [x] Legacy single attachments still work
- [x] Upload progress feedback shown
- [x] Error handling for failed uploads

---

## Notes

- File size limit: 25MB per file (configured in multer)
- Accepted formats: PDF, DOC, DOCX, ZIP, PNG, JPG, JPEG
- Files stored in: `backend/uploads/` directory
- Upload endpoint: `POST /api/mentor/upload` (unchanged)
- Each file uploads sequentially to ensure all complete
- Toast notification shows total files uploaded

---

## Future Enhancements (Optional)

- Drag-and-drop file upload
- Parallel file uploads for faster processing
- File preview thumbnails
- Bulk file download (zip all attachments)
- File size indicator for each attachment
- Progress bar for large file uploads
