// components/UserManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import UserStats from './UserStats';
import UserFilters from './UserFilters';
import UserTabs from './UserTabs';
import UserDetailDialog from './UserDetailDialog';

export function UserManagement() {
   const [users, setUsers] = useState<User[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [roleFilter, setRoleFilter] = useState('all');
   const [selectedUser, setSelectedUser] = useState<User | null>(null);
   const [showUserDetail, setShowUserDetail] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchUsers = async () => {
         setIsLoading(true);
         try {
            const fetchedUsers = await userService.getAllUsers(); // Gọi API lấy người dùng
            setUsers(fetchedUsers); // Cập nhật state users
         } catch (err) {
            setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
            console.error(err);
         } finally {
            setIsLoading(false);
         }
      };
      fetchUsers();
   }, []);

   const handleStatusChange = (userId: string, newStatus: string) => {
      setUsers((prev) =>
         prev.map((user) =>
            user.id === userId ? { ...user, status: newStatus as any } : user
         )
      );
      // TODO: Gọi API để cập nhật trạng thái user khi backend cung cấp endpoint
   };

   const handleDeleteUser = (userId: string) => {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      // TODO: Gọi API để xóa user khi backend cung cấp endpoint
   };

   const openUserDetail = (user: User) => {
      setSelectedUser(user);
      setShowUserDetail(true);
   };

   return (
      <div className="space-y-6">
         {error && <div className="text-red-500">{error}</div>}
         {isLoading ? (
            <div className="text-center">Đang tải...</div>
         ) : (
            <>
               <UserStats users={users} />
               <UserFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  roleFilter={roleFilter}
                  setRoleFilter={setRoleFilter}
               />
               <UserTabs
                  users={users}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  roleFilter={roleFilter}
                  handleStatusChange={handleStatusChange}
                  handleDeleteUser={handleDeleteUser}
                  openUserDetail={openUserDetail}
               />
               <UserDetailDialog
                  selectedUser={selectedUser}
                  showUserDetail={showUserDetail}
                  setShowUserDetail={setShowUserDetail}
               />
            </>
         )}
      </div>
   );
}
