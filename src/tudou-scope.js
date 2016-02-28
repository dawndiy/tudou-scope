var scopes = require('unity-js-scopes')
var http = require('http');

var api_host = "api.tudou.com"
var app_key = "e549cd3d0174412d"

var HOME_TEMPLATE = {
    "schema-version": 1,
    "template": {
        "category-layout": "carousel",
        "card-size": "large",
        "overlay": true
    },
    "components": {
        "title": "title",
        "subtitle": "subtitle",
        "art": {
            "field": "art",
            "aspect-ratio": 1.1
        },
        "attributes": "attributes"
    }
}

var VIDEO_TEMPLATE = {
    "schema-version": 1,
    "template": {
        "category-layout": "grid",
        "card-size": "medium"
    },
    "components": {
        "title": "title",
        "subtitle": "subtitle",
        "art": {
            "field": "art",
            "aspect-ratio": 1.5
        },
        "attributes": "attributes"
    }
}

var LARGE_TEMPLATE = {
    "schema-verion": 1,
    "template": {
        "category-layout": "vertical-journal",
        "card-size": "large",
        "overlay": true
    },
    "components": {
        "title": "title",
        "subtitle": "subtitle",
        "art": {
            "field": "art",
            "aspect-ratio": 2.5
        },
        "attributes": "attributes"
    }
}

var QUERY_TEMPLATE = {
    "schema-version": 1,
    "template": {
        "category-layout": "grid",
        "card-layout": "horizontal",
        "card-size": "small"
    },
    "components": {
        "title": "title",
        "subtitle": "subtitle",
        "art": {
            "field": "art",
            "fill-mode": "fit",
            "aspect-ratio": 1.5
        },
        "attributes": "attributes"
    }
}



// tudou video channels
var channel_list = [{"channelId":1,"channelName":"娱乐"},{"channelId":3,"channelName":"生活"},{"channelId":5,"channelName":"搞笑"},{"channelId":9,"channelName":"动漫"},{"channelId":10,"channelName":"游戏"},{"channelId":14,"channelName":"音乐"},{"channelId":15,"channelName":"体育"},{"channelId":18,"channelName":"创意视频"},{"channelId":19,"channelName":"网络剧"},{"channelId":21,"channelName":"科技"},{"channelId":22,"channelName":"电影"},{"channelId":25,"channelName":"教育"},{"channelId":26,"channelName":"汽车"},{"channelId":28,"channelName":"纪实"},{"channelId":29,"channelName":"资讯"},{"channelId":30,"channelName":"电视剧"},{"channelId":31,"channelName":"综艺"},{"channelId":32,"channelName":"时尚"},{"channelId":33,"channelName":"健康"},{"channelId":34,"channelName":"美容"},{"channelId":39,"channelName":"微电影"},{"channelId":40,"channelName":"曲艺"}]

// Tudou
var tudou = {

    http_get: function(api, cb) {
        var res = ""
        http.request({
            host: api_host,
            path: encodeURI(api)
        }, function(response) {
            response.on("data", function(chunk) {
                res += chunk
            })
            response.on("end", function() {
                cb(JSON.parse(res))
            })
        }).end()
    },

    video: {

        search: function(options, cb) {
            var api = "/v6/video/search?app_key=" + app_key
            var keyword = options.keyword
            var count = options.count || 20
            var orderBy = options.orderBy

            api += "&kw=" + keyword +
                   "&pageSize=" + count
            if (orderBy) {
                api += "&orderBy=" + orderBy
            }

            console.log("search", "http://"+api_host+api)

            tudou.http_get(api, function(res) {
                cb(res.results || [])
            })
        },

        info: function(options, cb) {
            var itemCode = options.itemCode
        },

        top_list: function(options, cb) {
            var api = "/v6/video/top_list?app_key=" + app_key
            var channelId = options.channelId
            var count = options.count || 20
            var orderBy = options.orderBy

            api += "&pageSize=" + count
            if (channelId) {
                api += "&channelId=" + channelId
            }
            if (orderBy) {
                api += "&orderBy=" + orderBy
            }

            console.log("top_list", "http://"+api_host+api)

            tudou.http_get(api, function(res) {
                cb(res.results || [])
            })
        },

        comment_list: function(options, cb) {
            var itemCode = options.itemCode
            var getType = options.getType || "getCmt"
            var count = options.count
        }
    },

    playlist: {
        search: function(options, cb) {
            var api = "/v6/playlist/search?app_key=" + app_key
            var keyword = options.keyword
            var count = options.count || 20
            var orderBy = options.orderBy

            api += "&kw=" + keyword +
                   "&pageSize=" + count
            if (orderBy) {
                api += "&orderBy=" + orderBy
            }

            console.log("search", "http://"+api_host+api)

            tudou.http_get(api, function(res) {
                cb(res.results || [])
            })
        },
        top_list: function(options, cb) {
            var api = "/v6/playlist/top_list?app_key=" + app_key
            var channelId = options.channelId
            var count = options.count || 20
            var orderBy = options.orderBy

            api += "&pageSize=" + count
            if (channelId) api += "&channelId=" + channelId
            if (orderBy) api += "&orderBy=" + orderBy

            console.log("top_list", "http://"+api_host+api)

            tudou.http_get(api, function(res) {
                cb(res.results || [])
            })

        }
    }
}

var formatDuration = function(duration) {
    duration = duration / 1000
    var text = ""
    var hr = 0, min = 0, sec = 0
    sec = Math.floor(duration) % 60
    min = Math.floor(duration/60) % 60
    hr = Math.floor(duration/3600) % 60

    if (sec < 10) sec = "0" + sec
    if (min < 10) min = "0" + min
    if (hr < 10) hr = "0" + hr

    if (hr == 0) {
        text = min + ":" + sec
    } else {
        text = hr + ":" + min + ":" + sec
    }
    return text
}

var formatCount = function(count) {
    var text = ""
    if (count <= 9999) {
        text = String(count)
    } else if (count > 9999 && count <= 99999999) {
        var f = count / 10000
        text = String(f.toFixed(2)) + "万"
    } else if (count > 99999999) {
        f = count / 100000000
        text = String(f.toFixed(2)) + "亿"
    }
    return text
}

// Create departments
var createDepartment = function(canned_query, search_reply) {
    var home_department = new scopes.lib.Department("", canned_query, "全部");
    var video_department = new scopes.lib.Department("video", canned_query, "视频")
    var playlist_department = new scopes.lib.Department("playlist", canned_query, "豆单")
    channel_list.forEach(function(item) {
        var child_video_department = new scopes.lib.Department("video_" + item.channelId, canned_query, item.channelName)
        var child_playlist_department = new scopes.lib.Department("playlist_" + item.channelId, canned_query, item.channelName)
        video_department.add_subdepartment(child_video_department)
        playlist_department.add_subdepartment(child_playlist_department)
    })
    home_department.add_subdepartment(video_department)
    home_department.add_subdepartment(playlist_department)
    search_reply.register_departments(home_department)
}

// Show videos
var showVideos = function(channelId, canned_query, search_reply) {

    // create filter
    var optionsFilter = new scopes.lib.OptionSelectorFilter("video_filter", "默认排序", false)
    optionsFilter.set_display_hints(1)
    optionsFilter.add_option("c", "按评论数量排序")
    optionsFilter.add_option("r", "按节目的评分排序")
    optionsFilter.add_option("v", "按播放次数排序")
    optionsFilter.add_option("t", "按发布时间排序")
    optionsFilter.active_options(canned_query.filter_state())
    search_reply.push([optionsFilter], canned_query.filter_state())

    var orderBy = ""

    if (optionsFilter.has_active_option(canned_query.filter_state())) {
        var o = optionsFilter.active_options(canned_query.filter_state())
        orderBy = o[0].id()
    }

    tudou.video.top_list({
        channelId: channelId,
        orderBy: orderBy
    }, function(data) {
        var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(VIDEO_TEMPLATE))
        var category = search_reply.register_category("video_" + channelId, "视频", "", category_renderer)

        pushData("video", data, category, search_reply)
        search_reply.finished()
    })
}

// View Video
var viewVideo = function(video, preview_reply) {
    var layout1col = new scopes.lib.ColumnLayout(1);
    var layout2col = new scopes.lib.ColumnLayout(2);
    var layout3col = new scopes.lib.ColumnLayout(3);
    layout1col.add_column(["header", "video", "info", "summary", "actions"]);

    layout2col.add_column(["header", "video", "actions"]);
    layout2col.add_column(["info", "summary"]);

    layout3col.add_column(["header", "video", "actions"]);
    layout3col.add_column(["info", "summary"]);
    layout3col.add_column([]);

    preview_reply.register_layout([layout1col, layout2col, layout3col]);

    // Header
    var header = new scopes.lib.PreviewWidget("header", "header");
    header.add_attribute_mapping("title", "title");
    header.add_attribute_value("subtitle", "时长: " + formatDuration(video.totalTime));

    // Video
    var videoWidget = new scopes.lib.PreviewWidget("video", "video");
    videoWidget.add_attribute_value("source", video.playUrl)
    videoWidget.add_attribute_mapping("screenshot", "art")
    videoWidget.add_attribute_value("share-data", {uri: video.playUrl, "content-type": "link"})

    // Information
    var info = new scopes.lib.PreviewWidget("info", "table")
    info.add_attribute_value("title", "信息")
    info.add_attribute_value("values", [
        // ["别名", video.alias],
        ["标签", video.tags],
        ["发布时间", video.pubDate],
        ["播放数", formatCount(video.playTimes)],
        ["评论数", formatCount(video.commentCount)],
        ["挖 / 埋", formatCount(video.digCount) + " / " + formatCount(video.buryCount)],
    ])

    // Description
    var description = new scopes.lib.PreviewWidget("summary", "text");
    description.add_attribute_value("title", "描述")
    description.add_attribute_value("text", video.description);

    // Buttons
    var actions = new scopes.lib.PreviewWidget("actions", "actions")
    actions.add_attribute_value("actions", [{id: "play", label: "播放", uri: video.PlayUrl}])

    preview_reply.push([header, videoWidget, info, description, actions]);
    preview_reply.finished();
}

// Show playlists
var showPlaylists = function(channelId, canned_query, search_reply) {

    // create filter
    var optionsFilter = new scopes.lib.OptionSelectorFilter("playlist_filter", "默认排序", false)
    optionsFilter.set_display_hints(1)
    optionsFilter.add_option("subscribeTimes", "订阅数")
    optionsFilter.add_option("playtimes", "历史播放量")
    optionsFilter.active_options(canned_query.filter_state())
    search_reply.push([optionsFilter], canned_query.filter_state())

    var orderBy = ""

    if (optionsFilter.has_active_option(canned_query.filter_state())) {
        var o = optionsFilter.active_options(canned_query.filter_state())
        orderBy = o[0].id()
    }

    tudou.playlist.top_list({
        channelId: channelId,
        orderBy: orderBy
    }, function(data) {
        var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(VIDEO_TEMPLATE))
        var category = search_reply.register_category("playList_" + channelId, "豆单", "", category_renderer)

        pushData("playlist", data, category, search_reply)
        search_reply.finished()
    })
}

// View Playlist
var viewPlaylist = function(playlist, preview_reply) {
    var layout1col = new scopes.lib.ColumnLayout(1);
    var layout2col = new scopes.lib.ColumnLayout(2);
    var layout3col = new scopes.lib.ColumnLayout(3);
    layout1col.add_column(["header", "video", "info", "summary", "actions"]);

    layout2col.add_column(["header", "video", "actions"]);
    layout2col.add_column(["info", "summary"]);

    layout3col.add_column(["header", "video", "actions"]);
    layout3col.add_column(["info", "summary"]);
    layout3col.add_column([]);

    preview_reply.register_layout([layout1col, layout2col, layout3col]);

    // Header
    var header = new scopes.lib.PreviewWidget("header", "header");
    header.add_attribute_mapping("title", "title");
    header.add_attribute_value("subtitle", "订阅数: " + formatCount(playlist.subTimes));

    // Video
    var videoWidget = new scopes.lib.PreviewWidget("video", "video");
    videoWidget.add_attribute_value("source", playlist.playlistUrl)
    videoWidget.add_attribute_mapping("screenshot", "art")
    videoWidget.add_attribute_value("share-data", {uri: playlist.playlistUrl, "content-type": "link"})

    // Information
    var info = new scopes.lib.PreviewWidget("info", "table")
    info.add_attribute_value("title", "信息")
    info.add_attribute_value("values", [
        ["标签", playlist.tags],
        ["豆单创建时间", playlist.createDate],
        ["豆单更新时间", playlist.modifiedDate],
        ["视频个数", formatCount(playlist.itemCount)],
        ["播放数", formatCount(playlist.playTimes)],
    ])

    // Description
    var description = new scopes.lib.PreviewWidget("summary", "text");
//    description.add_attribute_value("title", "描述")
//    description.add_attribute_value("text", video.description);

    // Buttons
    var actions = new scopes.lib.PreviewWidget("actions", "actions")
//    var button_list = []
//    for (var i = 0; i < 100; i++) {
//        button_list.push({id: "" + i, label: "label_" + i})
//    }
//    actions.add_attribute_value("actions", button_list)

    actions.add_attribute_value("actions", [{id: "play", label: "豆单页面", uri: playlist.descriptionUrl}])

    preview_reply.push([header, videoWidget, info, description, actions]);
    preview_reply.finished();
}

var pushData = function(data_type, data, category, search_reply) {
    switch (data_type) {
    case "video":
        for (var i in data) {
            var item = data[i]
            var categorised_result = new scopes.lib.CategorisedResult(category)
            categorised_result.set_title(item.title)
            categorised_result.set_uri(item.playUrl)
            if (item.bigPicUrl) {
                categorised_result.set_art(item.bigPicUrl)
            } else if (item.picUrl) {
                categorised_result.set_art(item.picUrl)
            } else {
                categorised_result.set_art("")
            }
            var attr_duration = {value: "🕒" + formatDuration(item.totalTime)}
            var attr_playtimes = {value: "🔥" + formatCount(item.playTimes)}
            categorised_result.set("attributes", [attr_duration, attr_playtimes])

            categorised_result.set("data", item)
            categorised_result.set("type", "video")

            search_reply.push(categorised_result)
        }

        break;
    case "playlist":
        for (var i in data) {
            var item = data[i]
            var categorised_result = new scopes.lib.CategorisedResult(category)
            categorised_result.set_title(item.title)
            if (item.playlistUrl) {
                categorised_result.set_uri(item.playlistUrl)
            } else if (item.descriptionUrl) {
                categorised_result.set_uri(item.descriptionUrl)
            } else {
                categorised_result.set_uri("http://www.tudou.com/")
            }
            categorised_result.set("subtitle", "视频个数:" + item.itemCount)
            if (item.coverPicUrl) {
                categorised_result.set_art(item.coverPicUrl)
            } else if (item.playlistPicUrl) {
                categorised_result.set_art(item.playlistPicUrl)
            } else {
                categorised_result.set_art("")
            }
            var attr_duration = {value: "🖂" + formatCount(item.subTimes)}
            var attr_playtimes = {value: "🔥" + formatCount(item.playTimes)}
            categorised_result.set("attributes", [attr_duration, attr_playtimes])

            categorised_result.set("data", item)
            categorised_result.set("type", "playlist")

            search_reply.push(categorised_result)
        }
        break;
    }
}

// Show Home
var showHome = function(search_reply) {

    // -----------------------------
    // TOP 10
    // -----------------------------
    console.log("-------top--------")
    var top_type = "video"
    var top_order_by = "v"
    if (Math.random() > 0.5) {
        top_type = "playlist"
        top_order_by = "subscribeTimes"
    }
    var top_channel = channel_list[Math.floor(Math.random() * channel_list.length)]
    tudou[top_type].top_list({
        channelId: top_channel.channelId,
        orderBy: top_order_by,
        count: 10
    }, function(data) {
        console.log(top_channel.channelName, top_type)
        var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(HOME_TEMPLATE))
        var category
        if (top_type == "video") {
            category = search_reply.register_category("home", top_channel.channelName + "视频 TOP10", "", category_renderer)
        } else {
            category = search_reply.register_category("home", top_channel.channelName + "豆单 TOP10", "", category_renderer)
        }

        pushData(top_type, data, category, search_reply)

        // -----------------------------
        // Section One
        // -----------------------------
        console.log("-------one--------")
        var section_one_type = "video"
        if (top_type == "video") {
            section_one_type = "playlist"
        }
        var section_one_channel = channel_list[Math.floor(Math.random() * channel_list.length)]
        tudou[section_one_type].top_list({
            channelId: section_one_channel.channelId,
            count: 10
        }, function(section_one_data) {
            var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(VIDEO_TEMPLATE))
            var category
            if (section_one_type == "video") {
                category = search_reply.register_category("section_one", section_one_channel.channelName + "视频", "", category_renderer)
            } else {
                category = search_reply.register_category("section_one", section_one_channel.channelName + "豆单", "", category_renderer)
            }

            pushData(section_one_type, section_one_data, category, search_reply)

            // -----------------------------
            // Section Two
            // -----------------------------
            console.log("-------two--------")
            var section_two_type = "video"
            if (section_one_type == "video") {
                section_two_type = "playlist"
            }
            var section_two_channel = channel_list[Math.floor(Math.random() * channel_list.length)]
            tudou[section_two_type].top_list({
                channelId: section_two_channel.channelId,
                count: 10
            }, function(section_two_data) {
                var category_renderer_first = new scopes.lib.CategoryRenderer(JSON.stringify(LARGE_TEMPLATE))
                var category
                if (top_type == "video") {
                    category = search_reply.register_category("section_two_first", section_two_channel.channelName + "视频", "", category_renderer_first)
                } else {
                    category = search_reply.register_category("section_two_first", section_two_channel.channelName + "豆单", "", category_renderer_first)
                }
                if (section_two_data && section_two_data.length > 0) {
                    var first = [section_two_data.shift()]
                    pushData(section_two_type, first, category, search_reply)
                }
                category = search_reply.register_category("section_two", "", "", category_renderer)
                pushData(section_two_type, section_two_data, category, search_reply)

                // -----------------------------
                // Section Three
                // -----------------------------
                console.log("-------three--------")
                var section_three_type = "video"
                if (section_two_type == "video") {
                    section_three_type = "playlist"
                }
                var section_three_channel = channel_list[Math.floor(Math.random() * channel_list.length)]
                tudou[section_three_type].top_list({
                    channelId: section_three_channel.channelId,
                    count: 10
                }, function(section_three_data) {
                    var category_renderer_first = new scopes.lib.CategoryRenderer(JSON.stringify(LARGE_TEMPLATE))
                    var category
                    if (top_type == "video") {
                        category = search_reply.register_category("section_three_first", section_three_channel.channelName + "视频", "", category_renderer_first)
                    } else {
                        category = search_reply.register_category("section_three_first", section_three_channel.channelName + "豆单", "", category_renderer_first)
                    }
                    if (section_three_data && section_three_data.length > 0) {
                        var first = [section_three_data.shift()]
                        pushData(section_three_type, first, category, search_reply)
                    }
                    category = search_reply.register_category("section_three", "", "", category_renderer)
                    pushData(section_three_type, section_three_data, category, search_reply)

                    // Finish show home
                    search_reply.finished()
                })
            })
        })
    })
}


// Query Videos or Playlist
var queryVideosOrPlaylist = function(keyword, count, orderBy, search_reply) {
    tudou.video.search({
        keyword: keyword,
        count: count,
        orderBy: orderBy
    }, function(video_data) {
        var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(QUERY_TEMPLATE))
        var category = search_reply.register_category("query_video", keyword + " 视频搜索结果", "", category_renderer)
        pushData("video", video_data, category, search_reply)


        tudou.playlist.search({
            keyword: keyword,
            count: count,
            orderBy: orderBy
        }, function(playlist_data) {
            var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(QUERY_TEMPLATE))
            var category = search_reply.register_category("query_playlist", keyword + " 豆单搜索结果", "", category_renderer)
            pushData("playlist", playlist_data, category, search_reply)

            // Finish
            search_reply.finished()
        })
    })
}

// Search
var search = function(canned_query, metadata) {
    return new scopes.lib.SearchQuery(
        canned_query,
        metadata,
        // run
        function(search_reply) {

            // create department
            createDepartment(canned_query, search_reply)

            // init
            var query_string = canned_query.query_string()
            var department_id = canned_query.department_id() || ""
            var result_count = scopes.self.settings["result_count"].get_double() || 50
            var query_order_by_index = scopes.self.settings["query_order_by"].get_int() || 0
            var query_order_by = ""
            switch (query_order_by_index) {
            case 0:
                query_order_by = ""
                break
            case 1:
                query_order_by = "viewed_all"
                break
            case 2:
                query_order_by = "createTime"
                break
            }
            var display_size_index = scopes.self.settings["display_size"].get_int()
            switch (display_size_index) {
            case 0:
                VIDEO_TEMPLATE.template["card-size"] = "large"
                break
            case 1:
                VIDEO_TEMPLATE.template["card-size"] = "medium"
                break
            case 2:
                VIDEO_TEMPLATE.template["card-size"] = "small"
                break
            }

            console.log("[Query]", "query:", query_string, "department:", department_id)

            if (!query_string) {
                var department_split = department_id.split("_")
                switch (department_split[0]) {
                case "":
                    showHome(search_reply)
                    break
                case "video":
                    showVideos(department_split[1], canned_query, search_reply)
                    break
                case "playlist":
                    showPlaylists(department_split[1], canned_query, search_reply)
                    break
                }
            } else {
                queryVideosOrPlaylist(query_string, result_count, query_order_by, search_reply)
            }

        },
        // cancelled
        function() {
        });
}

// Preview
var preview = function(result, action_metadata) {
    return new scopes.lib.PreviewQuery(
        result,
        action_metadata,
        // run
        function(preview_reply) {
            var preview_type = result.get("type")
            console.log(preview_type)
            switch (preview_type) {
            case "video":
                var video = result.get("data")
                viewVideo(video, preview_reply)
                break
            case "playlist":
                var playlist = result.get("data")
                viewPlaylist(playlist, preview_reply)
                break
            }
        },
        // cancelled
        function() {
        });
}

scopes.self.initialize({
},{
    run: function() {
        console.log('Running...')
    },
    start: function(scope_id) {
        console.log('Starting scope id: '
                    + scope_id
                    + ', '
                    + scopes.self.scope_directory)
    },
    search: search,
    preview: preview,
    perform_action: function(result, metadata, widget_id, action_id) {
        console.log('Action performed', widget_id, action_id)

        return new scopes.lib.ActivationQuery(
            result,
            metadata,
            widget_id,
            action_id,
            // activate
            function() {
                console.log('Activate called');

                var activation_response;
                switch (action_id) {
                    default:
                        activation_response = new scopes.lib.ActivationResponse(
                            scopes.defs.ActivationResponseStatus.NotHandled);
                        break;
                }

                return activation_response;
            },
            // cancelled
            function() {
            }
        );
    }
});

