# 后端API迁移说明 - VIP系统整合

## 概述

前端已将漫画VIP和视频VIP整合到统一的 `/vip` 页面。后端需要相应调整API端点。

## 需要修改的API端点

### 1. 合并VIP Plans端点

**当前状态：**
- `/api/vip/plans` - 返回漫画VIP套餐
- `/api/vip/video-plans` - 返回视频VIP套餐

**需要修改为：**
- `/api/vip/plans` - 返回**所有**VIP套餐（包括漫画和视频）
- `/api/vip/video-plans` - **可以废弃或保持向后兼容**（重定向到 `/api/vip/plans`）

### 2. Plans数据结构

每个plan对象需要包含 `type` 字段来区分类型：

```json
{
  "success": true,
  "data": [
    {
      "key": "monthly",
      "type": "comic",           // 新增字段：'comic' 或 'video'
      "name": "月卡",
      "duration": 30,
      "duration_unit": "天",
      "price": 39,
      "original_price": 39,
      "save_amount": null,
      "features": ["无限制阅读全站漫画"],
      "popular": false
    },
    {
      "key": "quarterly",
      "type": "comic",
      "name": "季卡",
      "duration": 90,
      "duration_unit": "天",
      "price": 99,
      "original_price": 117,
      "save_amount": 18,
      "features": ["无限制阅读全站漫画"],
      "popular": false
    },
    {
      "key": "yearly",
      "type": "comic",
      "name": "年卡",
      "duration": 365,
      "duration_unit": "天",
      "price": 299,
      "original_price": 468,
      "save_amount": 169,
      "features": ["无限制阅读全站漫画"],
      "popular": true
    },
    {
      "key": "monthly-video",
      "type": "video",           // 新增字段：'comic' 或 'video'
      "name": "月卡",
      "duration": 30,
      "duration_unit": "天",
      "price": 39,
      "original_price": 39,
      "save_amount": null,
      "features": ["畅享全站视频"],
      "popular": false
    },
    {
      "key": "quarterly-video",
      "type": "video",
      "name": "季卡",
      "duration": 90,
      "duration_unit": "天",
      "price": 99,
      "original_price": 117,
      "save_amount": 18,
      "features": ["畅享全站视频"],
      "popular": false
    },
    {
      "key": "yearly-video",
      "type": "video",
      "name": "年卡",
      "duration": 365,
      "duration_unit": "天",
      "price": 299,
      "original_price": 468,
      "save_amount": 169,
      "features": ["畅享全站视频"],
      "popular": true
    }
  ]
}
```

### 3. 订单创建端点

**保持不变：**
- `/api/vip/create-order` - 接收 `plan_key` 和 `payment_method`
- 后端根据 `plan_key` 的格式判断订单类型：
  - 漫画：`monthly`, `quarterly`, `yearly`
  - 视频：`monthly-video`, `quarterly-video`, `yearly-video` (以 `-video` 结尾)
- 或者根据config/products.php中的type字段判断（`vip` 或 `video-vip`）

## 实施步骤

### 步骤1：修改 `/api/vip/plans` 端点

```php
// 示例Laravel代码
public function getPlans() {
    $comicPlans = ComicVipPlan::all()->map(function($plan) {
        return [
            'key' => $plan->key,
            'type' => 'comic',  // 添加类型标识
            'name' => $plan->name,
            'duration' => $plan->duration,
            'duration_unit' => $plan->duration_unit,
            'price' => $plan->price,
            'original_price' => $plan->original_price,
            'save_amount' => $plan->save_amount,
            'features' => $plan->features,
            'popular' => $plan->popular
        ];
    });

    $videoPlans = VideoVipPlan::all()->map(function($plan) {
        return [
            'key' => $plan->key,
            'type' => 'video',  // 添加类型标识
            'name' => $plan->name,
            'duration' => $plan->duration,
            'duration_unit' => $plan->duration_unit,
            'price' => $plan->price,
            'original_price' => $plan->original_price,
            'save_amount' => $plan->save_amount,
            'features' => $plan->features,
            'popular' => $plan->popular
        ];
    });

    $allPlans = $comicPlans->concat($videoPlans);

    return response()->json([
        'success' => true,
        'data' => $allPlans
    ]);
}
```

### 步骤2：处理旧的 `/api/vip/video-plans` 端点（可选）

有两种选择：

**选项A：废弃并返回错误**
```php
public function getVideoPlans() {
    return response()->json([
        'success' => false,
        'message' => 'This endpoint is deprecated. Please use /api/vip/plans instead.'
    ], 410);
}
```

**选项B：重定向到新端点（推荐，向后兼容）**
```php
public function getVideoPlans() {
    // 重用getPlans()方法，但只过滤video类型
    $allPlans = $this->getPlans()->getData()->data;
    $videoPlans = array_filter($allPlans, function($plan) {
        return $plan->type === 'video';
    });

    return response()->json([
        'success' => true,
        'data' => array_values($videoPlans)
    ]);
}
```

### 步骤3：确保订单创建正确处理两种类型

```php
public function createOrder(Request $request) {
    $planKey = $request->input('plan_key');
    $paymentMethod = $request->input('payment_method');

    // 根据plan_key判断类型
    if (str_starts_with($planKey, 'comic-')) {
        $plan = ComicVipPlan::where('key', $planKey)->first();
        $orderType = 'comic';
        $expiryField = 'expired_at';
    } elseif (str_starts_with($planKey, 'video-')) {
        $plan = VideoVipPlan::where('key', $planKey)->first();
        $orderType = 'video';
        $expiryField = 'video_expired_at';
    } else {
        return response()->json([
            'success' => false,
            'message' => 'Invalid plan key'
        ], 400);
    }

    if (!$plan) {
        return response()->json([
            'success' => false,
            'message' => 'Plan not found'
        ], 404);
    }

    // 创建订单...
    $order = Order::create([
        'user_id' => auth()->id(),
        'plan_key' => $planKey,
        'plan_type' => $orderType,
        'amount' => $plan->price,
        'payment_method' => $paymentMethod,
        'status' => 'pending'
    ]);

    // 生成支付链接...
    $paymentUrl = $this->generatePaymentUrl($order, $paymentMethod);

    return response()->json([
        'success' => true,
        'order_id' => $order->id,
        'payment_url' => $paymentUrl
    ]);
}
```

## 数据库迁移（如果需要）

如果plans存储在数据库中，可能需要添加 `type` 列：

```php
// database/migrations/xxxx_add_type_to_vip_plans.php
Schema::table('vip_plans', function (Blueprint $table) {
    $table->enum('type', ['comic', 'video'])->default('comic')->after('key');
});

// 或者为视频plans添加type
Schema::table('video_vip_plans', function (Blueprint $table) {
    $table->enum('type', ['comic', 'video'])->default('video')->after('key');
});
```

## 测试清单

- [ ] `/api/vip/plans` 返回包含 `type` 字段的所有plans
- [ ] `/api/vip/plans` 同时返回comic和video类型的plans
- [ ] `/api/vip/video-plans` 正确处理（废弃或重定向）
- [ ] `/api/vip/create-order` 能正确处理comic类型的plan_key
- [ ] `/api/vip/create-order` 能正确处理video类型的plan_key
- [ ] 订单创建后正确更新相应的VIP过期时间字段
  - Comic plans → `users.expired_at`
  - Video plans → `users.video_expired_at`

## 前端变更摘要

前端已完成以下修改：
1. ✅ 整合 `/vip` 和 `/vip-video` 页面为统一的 `/vip` 页面
2. ✅ 添加Tab切换功能（漫画会员 / 视频通行证）
3. ✅ 更新所有 `/vip-video` 链接为 `/vip?tab=video`
4. ✅ 添加路由重定向：`/vip-video` → `/vip?tab=video`
5. ✅ API调用已更新为统一使用 `getVipPlans()`

## 向后兼容性

前端代码已设计为向后兼容：
- 如果plan对象没有 `type` 字段，默认视为 `comic` 类型
- `/vip-video` 路由自动重定向到 `/vip?tab=video`

## 问题排查

如果遇到问题，请检查：
1. `/api/vip/plans` 响应中是否包含 `type` 字段
2. plans数组是否同时包含comic和video类型
3. plan_key的命名约定是否正确（建议使用 `comic-*` 和 `video-*` 前缀）
4. 订单创建时是否正确识别plan类型并更新相应的VIP过期时间字段
