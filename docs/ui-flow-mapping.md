# Mapping Luồng Hoạt Động SmashHub UI (UI Flows Mapping)

Dựa trên việc kiểm tra toàn bộ source code và các file định tuyến (routes) trong thư mục `src/router/`, hệ thống đã liên kết và có đầy đủ tất cả các screens, tabs, và components cần thiết cho 3 luồng người dùng: **Organizer**, **Public Player**, và **Referee/Chief Referee**.

Dưới đây là danh sách chi tiết các screen và cách chúng liên kết/chuyển đổi với nhau dựa trên hành động của người dùng:

---

## 1. Luồng Organizer (Ban Tổ Chức)

Các route của Organizer nằm trong `OrganizerRoutes.tsx` với tiền tố `/organizer`.

- **Organizer Dashboard (`/organizer`)**
  - Hiển thị thống kê tổng quan.
  - **Liên kết:** Click chọn chức năng "Quản lý Giải đấu" trên thanh điều hướng/sidebar sẽ chuyển đến screen `OrganizerTournaments`.

- **Organizer Tournaments (`/organizer/tournaments`)**
  - Hiển thị danh sách các giải đấu do organizer này tạo.
  - **Liên kết:** Nút "Tạo Giải Đấu" (Create Tournament) sẽ chuyển hướng tới màn hình `TournamentForm`.

- **Tournament Form (`/organizer/tournaments/new` hoặc `.../:id/edit`)**
  - Màn hình này sử dụng giao diện **Wizard (nhiều bước / tabs)** bao gồm: Details, Categories, Format, Schedule.
  - **Liên kết:** Ở bước cuối (Schedule), hệ thống gọi API `/schedule-configs/validate` để validate. Nếu thành công, click "Hoàn tất/Create", hệ thống lần lượt tạo Tournament -> tạo Schedule Config và sau đó **tự động chuyển hướng (redirect)** về trang `TournamentDetail` của giải đấu vừa tạo.

- **Tournament Detail (`/organizer/tournaments/:tournamentId`)**
  - Đây là trung tâm quản lý một giải đấu, sử dụng giao diện **Tabs** để chuyển đổi hiển thị:
  - **Overview Tab:** Hiển thị thông tin chung. Các quick actions hoặc alerts thiếu data sẽ bị ẩn đi.
  - **Referees Tab:** Gọi API `/tournament-referees/tournament/{id}/available`, hiển thị danh sách referee/chief_referee. Có nút "Invite" để gửi lời mời trực tiếp từ màn hình này.
  - **Entries Tab:** Gọi API `/entries/category/{id}/eligible`, hiển thị danh sách đăng ký. Cung cấp nút "Mass Disqualify" để loại các entries không hợp lệ sau khi đóng đăng ký.
  - **Matches / Draws Tab:** Quản lý vòng đấu và lịch thi đấu.
    - *Với Group Stage (isGroupStage = true):* Nút Generate Group Stage -> Save -> Nút Generate Knockout Placeholders -> Save -> Nút Generate Full Schedule. Quá trình này giữ người dùng ở tab hiện tại và update data trên màn hình. Sau khi vòng bảng xong, có nút "Fill Qualifiers" để điền người thắng vào vòng knockout.
    - *Với Single Knockout (isGroupStage = false):* Nút Preview from entries -> Save -> Generate Knockout Schedule.

---

## 2. Luồng Public Player (Người Chơi Mở)

Các route của Public Player nằm trong `PublicRoutes.tsx`.

- **Tournament Listing (`/tournaments`) & Landing (`/`)**
  - Xem danh sách giải.
  - **Liên kết:** Click vào một giải đấu chuyển sang `TournamentDetail`.

- **Tournament Detail (Public) (`/tournaments/:tournamentId`)**
  - Xem thông tin giải đấu.
  - **Liên kết:** Click nút "Register" chuyển sang màn hình `EntryRegistration`.

- **Entry Registration (`/tournaments/:tournamentId/register`)**
  - Đăng ký tham gia giải.
  - *Với Single:* Tự động tạo entry và chuyển sang `Checkout`.
  - *Với Team/Double:* Hiển thị form cho chọn hành động "Create Team" hoặc "Join Team". Hoàn thành đăng ký sẽ chuyển sang `Checkout` hoặc màn hình `TeamManagement`.

- **Checkout / Thanh toán (`/checkout`)**
  - Xử lý các query thanh toán.

- **Team Management (`/team`)**
  - Gọi `/entries/{id}/my-role` để kiểm tra quyền.
  - *Nếu là Captain:* Màn hình hiện thêm danh sách yêu cầu tham gia (Join Requests). Cung cấp các nút Approve/Reject. Các thao tác cập nhật số lượng member, chuyển quyền captain, xóa member đều thực hiện trực tiếp trên màn hình này. Click "Confirm Lineup" (khi đủ điều kiện) để chốt danh sách đội.

- **Match Center / History (`/matches`, `/history`)**
  - Gọi API lịch sử và sắp diễn ra. Hiển thị danh sách các Match.
  - **Liên kết với Elo:** Click vào một trận đấu đã xong sẽ chuyển tới (hoặc mở modal) chi tiết biến động Elo (`/elo-histories/match/{id}`).
  - **Submit Lineup (Dành cho Captain đánh Team):** Tại Match Center, với các trận sắp diễn ra, captain sẽ thấy nút "Submit Lineup" (điền submatch players). Nếu lineup bị từ chối, sẽ có alert hoặc khu vực riêng cho "Rejected Lineups" để click vào submit lại.

- **Elo Leaderboard & History (`/elo`, `/elo/history`)**
  - Hiển thị danh sách xếp hạng Elo và biểu đồ lịch sử Elo theo User (`/elo-histories/user/{id}`).

---

## 3. Luồng Referee và Chief Referee (Trọng Tài)

Các route nằm trong `RefereeRoutes.tsx` với tiền tố `/referee`. Hệ thống tự động kiểm tra RoleGuard cho "referee" hoặc "chief_referee".

- **Pending Invitations (`/referee/invitations`)**
  - Trang mặc định khi referee đăng nhập. Hiển thị danh sách thiệp mời.
  - **Liên kết:** Click Accept hoặc Reject. Accept thành công sẽ làm mới dữ liệu và người dùng có thể xem giải đấu đó trong menu Tournaments.

- **Referee Tournaments (`/referee/tournaments`)**
  - Danh sách giải đấu mà trọng tài đang làm việc.
  - **Liên kết:** Click vào một giải đấu chuyển hướng đến `TournamentDetail` của referee.

- **Tournament Detail - Referee (`/referee/tournaments/:tournamentId`)**
  - **Với Chief Referee:** Hiển thị danh sách tổng Matches của giải. Sẽ có nút "Mass Start Matches". Cung cấp liên kết để xem/duyệt pending matches.
  - **Với Referee (Umpire):** Hiển thị mục danh sách các trận đấu (`/matches/referee/my`) mình được phân công.
  - **Liên kết:** Click vào một Match sẽ chuyển đến màn hình `MatchExecution`.

- **Pending Matches Global (`/referee/pending-matches`)**
  - **Chỉ Chief Referee:** Màn hình riêng hiển thị các match đã kết thúc (Finalized by Umpire) cần được Approve hoặc Reject.

- **Match Execution (`/referee/matches/:matchId`)**
  - Đây là khu vực thao tác quan trọng nhất của Umpire. Nó sử dụng cấu trúc **Accordion hoặc List Submatches**.
  - **Lineup Approval:** Trước khi thi đấu, Umpire thấy danh sách "Pending Lineups". Click nút Approve/Reject. Chỉ khi Approve xong mới có thể bấm "Start" các sub-match.
  - **Quản lý Set:** Bấm "Start" sub-match sẽ mở ra giao diện nhập điểm (Scoreboard).
    - Cứ mỗi lần nhập điểm (PUT live-score), UI gọi lại API.
    - *TH2 (Set kết thúc):* UI tự động chuyển sang set tiếp theo.
    - *TH3 (Submatch kết thúc):* UI hiện ra nút "Finalize Submatch". Bấm Finalize, UI sẽ đóng score-board hiện tại và quay về màn hình danh sách sub-matches của Match đó để tiếp tục Start submatch khác.
    - *TH Final (Match kết thúc):* Nếu đây là submatch quyết định, sau khi Finalize Submatch, UI sẽ hiện thông báo "Match is ready to finalize" kèm nút **"Finalize Match"**. Bấm nút này sẽ đẩy Match lên hàng chờ của Chief Referee, Umpire hoàn thành nhiệm vụ và được tự động redirect về danh sách Matches.
