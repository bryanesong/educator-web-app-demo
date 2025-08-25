# 📊 Conversations Table Structure

## Table Columns (8 total)

| Column | Type | Sortable | Description | Example |
|--------|------|----------|-------------|---------|
| **Student** | Text | ✅ | Child's name from database | "Emma Wilson" |
| **Character** | Avatar + Text | ✅ | AI character with image | Koko the Panda 🐼 |
| **Date** | Date | ✅ | Conversation date (MM/DD/YYYY) | "4/11/2025" |
| **Time** | Time | ✅ | Conversation time (HH:MM) | "2:39 PM" |
| **Duration** | Text | ✅ | Length of conversation | "12 minutes" |
| **Mood Score** | Number + Color | ✅ | Emotional wellness (0-10) | 8.5/10 (green) |
| **Topics** | Badges | ❌ | Conversation themes | friendship, sharing |
| **Actions** | Button | ❌ | Available operations | "View Transcript" |

## Sorting Behavior

- **Default Sort**: Date (newest first)
- **Sort Indicators**: ↑ (ascending) ↓ (descending) ↕ (unsorted)
- **Server-Side**: Student, Character, Date, Time, Duration
- **Client-Side**: Mood Score (calculated from API data)

## Date/Time Display

- **Date Column**: Shows `MM/DD/YYYY` format using `toLocaleDateString()`
- **Time Column**: Shows `HH:MM AM/PM` format using `toLocaleTimeString()`
- **Both derive from**: `start_date_time` field from Django API

## Responsive Design

- **Mobile**: Table scrolls horizontally
- **Desktop**: All columns visible
- **Character Column**: Images scale properly for legacy characters

## Loading States

- **8 skeleton columns** with animated placeholders
- **5 skeleton rows** during data fetch
- **Maintains table structure** during loading

## Empty States

- **No Data**: "No conversations found"
- **Error**: "Failed to load conversations"
- **Spans all 8 columns** with centered message