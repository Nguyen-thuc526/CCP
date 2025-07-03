import { NotificationList } from '@/components/counselor/notification-list';

export default function NotificationsPage() {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Thông báo</h1>
         <NotificationList />
      </div>
   );
}
