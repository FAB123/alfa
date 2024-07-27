<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Order;
use App\Models\OrderedItem;
use App\Models\Tag;
use App\Models\Token;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
// use Intervention\Image\ImageManager;


class ItemController extends Controller
{
    public function index()
    {
        $user = $this->getUser();
        return Inertia::render('Orders/ListOrders', ['user' => $user]);
    }

    public function manage_items()
    {
        $user = $this->getUser();
        $tags = Tag::pluck('tag');
        return Inertia::render('Orders/ListItems', ['user' => $user, 'tags' => $tags]);
    }

    public function manage_tags()
    {
        $user = $this->getUser();
        $result = Tag::where('shop_id', $user['shop_id'])->get();
        return Inertia::render('Orders/ListTags', ['user' => $user, 'tags' => $result]);
    }

    //tags
    public function save_tag(Request $request)
    {
        try {
            if (!auth()->user()->enable_ordering) {
                return response()->json([
                    'message' => "Permission Denied",
                    'status' => false
                ], 200);
            }
            $user = auth()->user();
            Tag::updateOrCreate(
                ['id' => $request->input('tag_id')],
                [
                    'tag' => $request->input('tag'),
                    'shop_id' => $user->shop_id
                ]
            );
            return response()->json([
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            return ($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred'
            ], 500);
        }
    }

    public function delete_tag($item)
    {
        try {
            Tag::find($item)->delete();
            return response()->json([
                'status' => true
            ], 200);
        } catch (\Throwable $th) {
            return $th->getMessage();
            return response()->json([
                'status' => false
            ], 200);
        }
    }

    public function get_items($page, $size = 10, $keyword, $sortitem, $sortdir)
    {

        $query = Item::query();
        // if ($keyword != 'null') {

        //     $query->whereRaw("name LIKE '%" . $keyword . "%'")
        //         ->orWhereRaw("address_line_1 LIKE '%" . $keyword . "%'")
        //         ->orWhereRaw("email LIKE '%" . $keyword . "%'")
        //         ->orWhereRaw("username LIKE '%" . $keyword . "%'")
        //         ->orWhereRaw("mobile LIKE '%" . $keyword . "%'");
        // }

        if ($sortitem != 'null') {
            $query->orderBy($sortitem, $sortdir);
        }

        $result = $query->paginate($size, ['*'], 'page', $page);

        return response()->json([
            'table' => $result,
        ], 200);
    }

    public function save_item(Request $request)

    {
        try {
            if (!auth()->user()->enable_ordering) {
                return response()->json([
                    'message' => "Permission Denied",
                    'status' => false
                ], 200);
            }
            $user = auth()->user();
            $itemData = $request->only(['item_name', 'category', 'unit_price', 'description', 'bgColor', 'tags', 'txtColor']);
            $itemData['shop_id'] = $user->shop_id;

            // if ($request->hasFile('image')) {
            //     $image = $request->file('image');
            //     $filePath = $image->store('item_img', 'public');
            //     $fileName = basename($filePath);
            //     $itemData['pic_filename'] = $fileName;
            // }

            $itemId = $request->input('item_id');
            $itemId = $itemId === 'null' ? null : $itemId;

            Item::updateOrCreate(
                ['item_id' => $itemId],
                $itemData
            );

            // Item::updateOrCreate(
            //     ['item_id' => $request->input('item_id') === 'null' ? null : $request->input('item_id')],
            //     $itemData
            // );
            return response()->json(['status' => true], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred: ' . $th->getMessage(),
            ], 500);
        }
    }

    public function delete_item($item)
    {
        try {
            Item::find($item)->delete();
            return response()->json([
                'status' => true
            ], 200);
        } catch (\Throwable $th) {
            return $th->getMessage();
            return response()->json([
                'status' => false
            ], 200);
        }
    }

    public function save_order(Request $request)
    {
        try {
            if (!auth()->user()->enable_ordering) {
                return response()->json([
                    'message' => "Permission Denied",
                    'status' => false
                ], 200);
            }
            $shop_id = auth()->user()->shop_id;
            $items = $request->input('items');
            $comments =  $request->input('comments');
            $total =  $request->input('total');
            $counter_id = auth()->user()->ordering_counter;
            if ($counter_id) {
                $issued_token = Token::find($counter_id)->increment('issued_count') ? Token::find($counter_id)->first()->issued_count : null;
                if ($issued_token) {
                    DB::beginTransaction();
                    $order = Order::create([
                        'shop_id' => $shop_id,
                        'token_number' => $issued_token,
                        'employee_id' => auth()->user()->id,
                        'comments' => $comments,
                        'total' => $total,
                    ]);
                    if ($order) {
                        foreach ($items as $item) {
                            $item_data = [
                                'order_id' => $order->order_id,
                                'item_id' => $item['item_id'],
                                'tags' => $item['tags'],
                                'order_quantity' => $item['quantity'],
                                'item_unit_price' => $item['total'],
                            ];
                            OrderedItem::Create($item_data);
                        }

                        DB::commit();
                        $encrypted_counter_id = base64_encode($counter_id);
                        $encrypted_shop_id = base64_encode($shop_id);

                        $qr_code = "https://token.ahcjed.com/mytoken/$encrypted_shop_id/$encrypted_counter_id/$issued_token";

                        return response()->json([
                            'order' => [
                                'issued_token' => $issued_token,
                                'items' => $items,
                                'total' =>  $total,
                                'qr_code' => $qr_code
                            ],
                            'status' => true
                        ], 200);
                    }
                } else {
                    return response()->json([
                        'message' => "Error issuing Token",
                        'status' => false
                    ], 200);
                }
                return $issued_token;
            } else {
                return response()->json([
                    'message' => "Ordering Not Enabled",
                    'status' => false
                ], 200);
            }
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'message' => "Unknown error",
                'status' => false
            ], 200);
        }
    }

    public function getOrderList($mode, $dir)
    {
        try {
            $user = $this->getUser();
            $result = Order::where('shop_id', $user['shop_id'])
                ->with(['ordered_items.item:item_id,item_name'])
                ->when(
                    $mode,
                    function ($query) use ($mode) {
                        switch ($mode) {
                            case 'pending':
                                $query->whereNotIn('status', ['C', 'CO']);
                                break;
                            case 'canceled':
                                $query->where('status', 'CO');
                                break;
                            case 'completed':
                                $query->where('status', 'C');
                                break;
                        }
                    }
                )
                ->orderBy('order_id', $dir)
                ->get();
            return response()->json([
                'status' => true,
                'result' => $result
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false
            ], 200);
        }
    }

    public function update_order_item(Request $request)
    {
        try {
            $order_id = $request->input('order_id');
            $status = $request->input('status');
            $order = Order::findOrFail($order_id);
            $order->update(['status' => $status]);

            return response()->json([
                'status' => true,
            ], 200);
        } catch (ModelNotFoundException $e) {
            info($e->getMessage());
            return response()->json([
                'status' => false
            ], 200);
        }
    }

    private function getUser()
    {
        $user = [
            'shop_name' => auth()->user()->shop_name,
            'shop_id' => auth()->user()->shop_id,
            'shop_name_ar' => auth()->user()->shop_name_ar,
            'counters' => auth()->user()->counters,
            'encrypted_user' => auth()->user()->encrypted_user,
            'enable_ordering' => auth()->user()->enable_ordering
        ];
        return $user;
    }
}
