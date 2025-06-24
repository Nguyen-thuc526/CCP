import { Card, CardContent } from "@/components/ui/card";
import { Member } from "@/types/member";
import { AccountStatus } from "@/utils/enum";

interface MemberStatsProps {
  members: Member[];
}

export default function MemberStats({ members }: MemberStatsProps) {
  const getStats = () => {
    const total = members.length;
    const active = members.filter((m) => m.status === AccountStatus.Active).length;
    const blocked = members.filter((m) => m.status === AccountStatus.Block).length;

    return { total, active, blocked };
  };

  const stats = getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Tổng thành viên</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-muted-foreground">Đang hoạt động</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
          <div className="text-sm text-muted-foreground">Đã chặn</div>
        </CardContent>
      </Card>
    </div>
  );
}
