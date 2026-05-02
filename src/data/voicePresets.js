export const CATEGORIES = [
  { key: 'featured', label: '精选推荐', icon: 'sparkles' },
  { key: 'female_gentle', label: '温柔女声', icon: 'heart' },
  { key: 'commercial', label: '商业配音', icon: 'briefcase' },
  { key: 'narrative', label: '影视解说', icon: 'film' },
  { key: 'education', label: '知识教育', icon: 'bookOpen' },
  { key: 'entertainment', label: '游戏动漫', icon: 'gamepad' },
  { key: 'daily', label: '日常对话', icon: 'users' },
];

export const VOICE_PRESETS = {
  featured: [
    { id: "7f92f8afb8ec43bf81429cc1c9199cb1", name: "温柔御姐", desc: "成熟优雅的女声，情感叙事、影视配音首选", tags: ["御姐", "情感", "叙述"], sampleUrl: "https://platform.r2.fish.audio/task/7c42baa3e702406d8a4f03c0261a6db0.wav" },
    { id: "dd43b30d04d9446a94ebe41f301229b5", name: "大气男声", desc: "浑厚沉稳的男中音，央视纪录片风格", tags: ["男声", "浑厚", "宣传片"], sampleUrl: "https://platform.r2.fish.audio/task/74b32b61c30e4db99428c66bcfccbbda.mp3" },
    { id: "59cb5986671546eaa6ca8ae6f29f6d22", name: "央视配音", desc: "标准普通话播报，专业清爽", tags: ["男声", "标准", "播音"], sampleUrl: "https://platform.r2.fish.audio/task/121e958e29924b01807894e1aeb767c7.mp3" },
    { id: "15f46374f9a24e57a3086e8a7cd035cf", name: "浑厚男声", desc: "浑厚成熟的男中音，纪录片/宣传片配音首选", tags: ["男声", "浑厚", "宣传片"], sampleUrl: "https://platform.r2.fish.audio/task/3de33354d8c64a7d839cf7598e26f2f6.mp3" },
    { id: "5a5f9f8cd244462493916d5652e7c913", name: "甜美女声", desc: "清新甜美的年轻女声，轻松愉悦的氛围", tags: ["甜美", "清新", "年轻"], sampleUrl: "https://platform.r2.fish.audio/task/b1ccb6ab668e4179a88629573464a3f4.mp3" },
    { id: "d99547e2dad64ce0aa085319a3c9cc56", name: "温柔男声", desc: "温暖治愈的温柔男声，适合有声书朗读", tags: ["男声", "温柔", "讲故事"], sampleUrl: "https://platform.r2.fish.audio/task/9f0c9c74cd10405cb957f1a8f6c2ef7c.mp3" },
    { id: "a7c968dd2be045b9af21fbaa5ddabe60", name: "磁性男声", desc: "温暖专业的磁性男中音，播客/知识分享", tags: ["男声", "磁性", "播客"], sampleUrl: "https://platform.r2.fish.audio/task/f46dc30f0fe141b68a410b191ddbaf76.mp3" },
    { id: "c7cbda1c101c4ce8906c046f01eca1a2", name: "文艺男声", desc: "温暖平和的男声，适合阅读、生活感悟", tags: ["男声", "文艺", "温暖"], sampleUrl: "https://platform.r2.fish.audio/task/b1b292a2f99044f0862c3eb41595cfe7.mp3" },
  ],
  female_gentle: [
    { id: "faccba1a8ac54016bcfc02761285e67f", name: "温柔动听", desc: "抑扬顿挫的温柔女声，适合情感表达、睡前故事", tags: ["温柔", "动听", "叙事"], sampleUrl: "https://platform.r2.fish.audio/task/67a8fd3936304523b52b639aa54d4aeb.mp3" },
    { id: "32ea6ed2f793439da52685ac910534ac", name: "温柔教师", desc: "耐心温和的女教师，课程讲解娓娓道来", tags: ["教师", "耐心", "教育"], sampleUrl: "https://platform.r2.fish.audio/task/710229d87cfc4d3b9e26871270b25627.mp3" },
    { id: "26c259f0f07247c98899ae4cfa1774be", name: "温柔女声", desc: "舒缓平静的柔和女声，适合治愈系内容", tags: ["舒缓", "柔和", "治愈"], sampleUrl: "https://platform.r2.fish.audio/task/07c8b3551a6d42389eb19840832beda5.mp3" },
    { id: "68c13a4c190a4057a6c1f91e72c6c3e4", name: "文艺女声", desc: "文艺气质的女声，如细雨轻敲般温柔动人", tags: ["文艺", "细腻", "诗意"], sampleUrl: "https://platform.r2.fish.audio/task/fbad33288fd541728c797c521e9a325a.mp3" },
    { id: "c31b878e13bb47e0a549549b6b41005f", name: "甜美配音", desc: "专业温柔的女声配音，抑扬顿挫富有感染力", tags: ["甜美", "配音", "专业"], sampleUrl: "https://platform.r2.fish.audio/task/f9991001731549a6a422d25b23ab85d7.mp3" },
    { id: "818bec7c25cd45d6960b93e627b2ccd3", name: "疗愈女声", desc: "温暖治愈的成熟女声，冥想身心放松必备", tags: ["疗愈", "温暖", "冥想"], sampleUrl: "https://platform.r2.fish.audio/task/e72d4920ffbc470f82d2c220b2dddba9.mp3" },
    { id: "3ff6b61ebc224e139bc4eb4a2f23507d", name: "轻语少女", desc: "轻柔耳语般的少女音，ASMR/亲密陪伴风格", tags: ["少女", "轻语", "亲密"], sampleUrl: "https://platform.r2.fish.audio/task/4755d7230bae4c4db7fb28bc7de30fc7.mp3" },
    { id: "32452e6670f84859beda742ac2ed8eae", name: "温柔母亲", desc: "慈爱温暖的母亲声音，育儿/家庭内容首选", tags: ["慈爱", "温暖", "家庭"], sampleUrl: "https://platform.r2.fish.audio/task/0d6bddba05354c7394f853e919429e7a.mp3" },
    { id: "1f2980c2a5c74213b56e115e47d59ad9", name: "舒缓冥想", desc: "缓慢柔和的冥想引导女声，安静心灵的声音", tags: ["冥想", "舒缓", "放松"], sampleUrl: "https://platform.r2.fish.audio/task/c24291d86ac746b0a5c4eb4eb9143dd2.mp3" },
    { id: "86d9f70d531c41649cf27ca12ac45bd1", name: "沉静女声", desc: "低沉温柔的成熟女声，深夜电台/情感节目", tags: ["低沉", "沉静", "电台"], sampleUrl: "https://platform.r2.fish.audio/task/c2e6953d5c3c41d7a13d603558eeaf82.mp3" },
    { id: "015a450de3ab48aaba383189aa004189", name: "知性女声", desc: "温柔知性的女声，娓娓道来，适合生活分享", tags: ["知性", "温和", "分享"], sampleUrl: "https://platform.r2.fish.audio/task/fe08e1602afb4bd69d38e066f327e323.mp3" },
  ],
  commercial: [
    { id: "4f201abba2574feeae11e5ebf737859e", name: "专业女播报", desc: "清晰利落的商业女声，购物中心/促销场景", tags: ["女声", "专业", "播报"], sampleUrl: "https://platform.r2.fish.audio/task/b84575f0f0cf47a7aa314656c1677a49.mp3" },
    { id: "c4c6d782c03645399d94008335520a18", name: "促销男声", desc: "热情有力的带货风格，直播/短视频适用", tags: ["男声", "促销", "直播"], sampleUrl: "https://platform.r2.fish.audio/task/7bcbdab4150e49e387cc00a455e55989.mp3" },
    { id: "bc9e47fd83a04010ad6617ed54b92ee3", name: "企业培训", desc: "自信专业的管理风格男声，适合课程讲解", tags: ["男声", "培训", "商务"], sampleUrl: "https://platform.r2.fish.audio/task/598966d3731e48e3b30a215bc9f5858b.mp3" },
    { id: "ce22ffa5f03a40d9b06ad8e9ae8dc893", name: "老教授口播", desc: "权威可信的老年男声，产品介绍/知识科普", tags: ["男声", "权威", "口播"], sampleUrl: "https://platform.r2.fish.audio/task/bba2c3938dfe4710815809e6e342ba29.mp3" },
    { id: "57eab548c7ed4ddc974c4c153cb015b2", name: "带货女主播", desc: "热情亲切的带货女声，直播促销好帮手", tags: ["女声", "直播", "带货"], sampleUrl: "https://platform.r2.fish.audio/task/6aa442115bf945699e91f10374c7c4e0.mp3" },
  ],
  narrative: [
    { id: "b4bdf5dc66004241a21ff2df165bf442", name: "影视解说", desc: "流畅自然的男声，短视频影视解说风格", tags: ["男声", "影视", "解说"], sampleUrl: "https://platform.r2.fish.audio/task/d7261d48cc7c4273bc39743585a54d8f.mp3" },
    { id: "f72b820e92524407922f6f1302e8bba2", name: "仙侠叙事", desc: "深沉沉稳的男声，古风/仙侠/有声书旁白", tags: ["男声", "仙侠", "旁白"], sampleUrl: "https://platform.r2.fish.audio/task/dff1f36a3d5b4a5fa8b0658532a29941.mp3" },
    { id: "21082ac382d945e29aea354e90380f11", name: "游戏评测", desc: "活力四射的年轻男声，游戏/电子产品评测", tags: ["男声", "游戏", "评测"], sampleUrl: "https://platform.r2.fish.audio/task/2d5e0ecb2de749df9b69651dd44bf9da.mp3" },
    { id: "ca8fb681ce2040958c15ede5eef86177", name: "商业演讲", desc: "自信有力的演讲风格，企业发布会/路演", tags: ["男声", "演讲", "发布会"], sampleUrl: "https://platform.r2.fish.audio/task/dfb8a41d5bcc419881fed861a121e648.mp3" },
  ],
  education: [
    { id: "b7f6ea6bf21246de894f6b9b499add43", name: "读书分享", desc: "温和平缓的男声，适合有声书/知识分享", tags: ["男声", "读书", "温和"], sampleUrl: "https://platform.r2.fish.audio/task/0ab65c4a5dc340a296ad7231c16592fa.mp3" },
    { id: "5aa3cb3ed8104bf798c23138d47309a3", name: "品牌配音", desc: "清晰利落的专业女声，商业配音通用音色", tags: ["女声", "通用", "清晰"], sampleUrl: "https://platform.r2.fish.audio/task/25aa877c803d46149fa4fc02ebeb68f3.mp3" },
  ],
  entertainment: [
    { id: "a9372068ed0740b48326cf9a74d7496a", name: "搞笑吐槽", desc: "快速激动的游戏/动画风格，情绪饱满", tags: ["男声", "搞笑", "游戏"], sampleUrl: "https://platform.r2.fish.audio/task/64048176afa3415a986dee1cfa98c309.mp3" },
    { id: "0eb38bc974e1459facca38b359e13511", name: "活力教练", desc: "热血向上的运动/训练风格，感染力强", tags: ["男声", "活力", "训练"], sampleUrl: "https://platform.r2.fish.audio/task/0db5556c7b194f629b4489bc2f290b4f.mp3" },
  ],
  daily: [
    { id: "5c353fdb312f4888836a9a5680099ef0", name: "邻家女孩", desc: "自然亲切的年轻女声，日常 Vlog/聊天感", tags: ["女声", "日常", "亲切"], sampleUrl: "https://platform.r2.fish.audio/task/81ecbe09d7cb49708cb1f836ada745b1.mp3" },
  ],
};

