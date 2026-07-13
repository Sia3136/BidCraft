const fs = require('fs');
const path = require('path');

const navbarPath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'navbar.tsx');
let content = fs.readFileSync(navbarPath, 'utf8');

// Find the NotificationsDropdown definition and replace it
const startIndex = content.indexOf('const NotificationsDropdown = () => (');
if (startIndex !== -1) {
  // Find the end of NotificationsDropdown by looking for ProfileDropdown
  const endIndex = content.indexOf('const ProfileDropdown = () => (', startIndex);
  
  if (endIndex !== -1) {
    const newNotificationsDropdown = `const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date('2026-09-01T00:00:00Z');
    const diff = Math.max(0, now.getTime() - date.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return \`\${hours}h ago\`;
    const days = Math.floor(hours / 24);
    return \`\${days}d ago\`;
  };

  const { notifications, markAllNotificationsRead, markNotificationRead } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationsDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute top-full right-0 mt-2 w-[320px] max-h-[420px] overflow-y-auto bg-[var(--color-white)] rounded-[var(--radius-md)] shadow-[var(--shadow-modal)] z-50 flex flex-col border border-[var(--color-border-subtle)] hide-scrollbar"
    >
      <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between sticky top-0 bg-[var(--color-white)] z-10">
        <h3 className="text-heading-sm text-[var(--color-ink-900)]">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllNotificationsRead()}
            className="text-caption font-bold text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="flex flex-col">
        {notifications.map((n) => (
          <Link
            key={n.id}
            href={n.productUrl}
            onClick={() => {
              if (!n.read) markNotificationRead(n.id);
              setOpenDropdown(null);
            }}
            className={cn(
              "flex gap-3 p-4 border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-cream-base)] transition-colors",
              !n.read && "bg-[var(--color-terracotta-100)]"
            )}
          >
            <div className="shrink-0 w-12 h-12 relative rounded-[var(--radius-sm)] overflow-hidden">
              <Image src={n.productImage} alt={n.title} fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm font-bold font-ui text-[var(--color-ink-900)] leading-tight">{n.title}</span>
              <span className="text-caption text-[var(--color-ink-700)] leading-snug">{n.body}</span>
              <span className="text-[11px] text-[var(--color-ink-500)] mt-1">{formatTime(n.timestamp)}</span>
            </div>
          </Link>
        ))}
        {notifications.length === 0 && (
          <div className="p-8 text-center text-body-md text-[var(--color-ink-500)]">
            No notifications yet
          </div>
        )}
      </div>
    </motion.div>
  )

  `;
    content = content.substring(0, startIndex) + newNotificationsDropdown + content.substring(endIndex);
  }
}

// Ensure the unread indicator dot reflects unreadCount
const bellRegex = /<Bell className="w-5 h-5" strokeWidth=\{1\.5\} \/>\s*<span className="absolute top-2 right-2 w-2\.5 h-2\.5 bg-\[var\(--color-urgent-600\)\] rounded-full border-\[1\.5px\] border-transparent" \/>/g;
const newBell = `<Bell className="w-5 h-5" strokeWidth={1.5} />
                    {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--color-urgent-600)] rounded-full border-[1.5px] border-transparent" />}`;
content = content.replace(bellRegex, newBell);

fs.writeFileSync(navbarPath, content);
console.log('navbar.tsx updated');
