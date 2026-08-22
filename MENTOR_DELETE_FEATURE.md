# Mentor Delete Feature

## Summary
Added delete functionality for mentors in the admin dashboard. Admins can now delete mentor accounts with a confirmation dialog.

---

## Changes Made

### 1. Backend - Mentor Routes (`backend/src/routes/mentor.js`)

**Added DELETE endpoint: `/mentor/admin/mentors/:id`**

Features:
- ✅ Validates mentor exists
- ✅ Unassigns all students from the mentor
- ✅ Deletes all mentor-related data:
  - Classes (MentorClass)
  - Attendance records
  - Assignments
  - Submissions
  - Projects
  - Notes
  - Messages (sent and received)
  - Notifications
- ✅ Deletes the mentor account
- ✅ Returns success message with mentor name
- ✅ Error handling with console logs

**Code:**
```javascript
router.delete('/admin/mentors/:id', protect, adminOnly, async (req, res) => {
  try {
    const mentor = await User.findOne({ _id: req.params.id, role: 'mentor' });
    
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    // Unassign all students
    await User.updateMany(
      { mentor: mentor._id, role: 'student' },
      { $set: { mentor: null } }
    );

    // Delete all mentor-related data
    await Promise.all([
      MentorClass.deleteMany({ mentor: mentor._id }),
      Attendance.deleteMany({ mentor: mentor._id }),
      Assignment.deleteMany({ mentor: mentor._id }),
      Submission.deleteMany({ mentor: mentor._id }),
      Project.deleteMany({ mentor: mentor._id }),
      Note.deleteMany({ mentor: mentor._id }),
      Message.deleteMany({ $or: [{ sender: mentor._id }, { recipient: mentor._id }] }),
      Notification.deleteMany({ $or: [{ recipient: mentor._id }, { data: { mentorId: mentor._id } }] })
    ]);

    // Delete mentor account
    await User.findByIdAndDelete(mentor._id);

    res.json({ 
      success: true, 
      message: `Mentor ${mentor.name} deleted successfully. All associated students have been unassigned.` 
    });
  } catch (err) {
    console.error('Delete mentor error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});
```

---

### 2. Frontend - API Utility (`frontend/src/utils/api.js`)

**Added API function:**
```javascript
export const deleteMentorAccount = (mentorId) => API.delete(`/mentor/admin/mentors/${mentorId}`);
```

---

### 3. Frontend - Admin Component (`frontend/src/components/Admin/Admin.jsx`)

#### A. Added Import
```javascript
import { deleteMentorAccount } from "../../utils/api";
```

#### B. Added Delete Function in MentorManagement
```javascript
const deleteMentor = async (mentor) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete mentor "${mentor.name}"?\n\n` +
    `This will:\n` +
    `• Delete the mentor account permanently\n` +
    `• Unassign all ${mentor.studentCount || 0} students from this mentor\n` +
    `• Delete all classes, assignments, and submissions\n` +
    `• This action cannot be undone!`
  );
  
  if (!confirmed) return;
  
  try {
    await deleteMentorAccount(mentor._id);
    toast.success(`Mentor ${mentor.name} deleted successfully`);
    load();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Unable to delete mentor');
  }
};
```

#### C. Added Delete Button to Mentor Card
```javascript
<button
  onClick={() => deleteMentor(m)}
  style={{
    flex: '0 0 auto',
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '7px',
    padding: '7px 10px',
    fontSize: '.72rem',
    fontWeight: 800,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px'
  }}
  title="Delete Mentor"
>
  🗑️
</button>
```

---

## UI Changes

### Before:
- Mentor cards had only 2 buttons:
  - 👁️ Dashboard →
  - 👥 Allocate (N)

### After:
- Mentor cards now have 3 buttons:
  - 👁️ Dashboard →
  - 👥 Allocate (N)
  - 🗑️ (Delete button with red background)

---

## User Flow

1. **Admin clicks delete button (🗑️)** on a mentor card
2. **Confirmation dialog appears** with warning message:
   ```
   Are you sure you want to delete mentor "John Doe"?
   
   This will:
   • Delete the mentor account permanently
   • Unassign all 5 students from this mentor
   • Delete all classes, assignments, and submissions
   • This action cannot be undone!
   ```
3. **Admin confirms** → Backend deletes all data
4. **Success toast appears** → "Mentor John Doe deleted successfully"
5. **Mentor list refreshes** → Deleted mentor removed from grid

---

## Safety Features

### ✅ Confirmation Dialog
- Shows mentor name
- Shows student count
- Lists all consequences
- Warns about permanence
- Requires explicit confirmation

### ✅ Data Cleanup
- Unassigns all students (they become unassigned, not deleted)
- Removes all mentor classes
- Removes all attendance records
- Removes all assignments created by mentor
- Removes all submissions for mentor's assignments
- Removes all projects assigned by mentor
- Removes all mentor notes
- Removes all mentor messages
- Removes all mentor notifications

### ✅ Error Handling
- 404 if mentor not found
- Console logs for debugging
- Toast error messages
- Try-catch blocks

---

## Button Styling

**Delete Button:**
- Background: Light red (`#fee2e2`)
- Text color: Dark red (`#dc2626`)
- Border: Red (`#fecaca`)
- Icon: 🗑️ (trash emoji)
- Hover: Cursor pointer
- Size: Compact (only icon, no text)
- Position: Right side after Allocate button

**Responsive:**
- Buttons wrap on smaller screens
- Delete button maintains size
- Dashboard and Allocate buttons can shrink

---

## Database Operations

When a mentor is deleted, these collections are affected:

1. **User Collection**
   - Students: `mentor` field set to `null`
   - Mentor: Document deleted

2. **MentorClass Collection**
   - All classes by this mentor: Deleted

3. **MentorAttendance Collection**
   - All attendance records: Deleted

4. **MentorAssignment Collection**
   - All assignments: Deleted

5. **MentorSubmission Collection**
   - All submissions: Deleted

6. **MentorProject Collection**
   - All projects: Deleted

7. **MentorNote Collection**
   - All notes: Deleted

8. **MentorMessage Collection**
   - Sent and received messages: Deleted

9. **MentorNotification Collection**
   - All notifications: Deleted

---

## API Endpoint

**DELETE** `/api/mentor/admin/mentors/:id`

**Auth Required:** Yes (Admin only)

**Parameters:**
- `id` (URL param): Mentor's MongoDB ObjectId

**Response Success (200):**
```json
{
  "success": true,
  "message": "Mentor John Doe deleted successfully. All associated students have been unassigned."
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Mentor not found"
}
```

**Response Error (500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Testing Checklist

- [x] Delete button appears on all mentor cards
- [x] Click delete shows confirmation dialog
- [x] Cancel confirmation does nothing
- [x] Confirm deletes mentor successfully
- [x] All students unassigned from deleted mentor
- [x] Mentor removed from list after deletion
- [x] Success toast appears after deletion
- [x] Error handling works for invalid mentor
- [x] All related data cleaned up in database
- [x] Page refreshes correctly after deletion

---

## Notes

- **Permanent Action**: Cannot be undone
- **Student Safety**: Students are unassigned, NOT deleted
- **Data Cleanup**: All mentor-related data is removed
- **Admin Only**: Only admins can delete mentors
- **Confirmation Required**: Users must explicitly confirm

---

## Future Enhancements (Optional)

- Archive mentors instead of deleting
- Soft delete with restore option
- Transfer students to another mentor before delete
- Export mentor data before deletion
- Activity log for mentor deletions
- Bulk delete multiple mentors
