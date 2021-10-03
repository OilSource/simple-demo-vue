<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items.list">
                <template v-if="null!=item.children && item.children.length >0">
                    <el-submenu :index="item.url" :key="item.url">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.label }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="null!=subItem.children && subItem.children.length >0" :index="subItem.url" :key="subItem.url">
                                <template #title>
                                  {{ subItem.label }}
                                </template>
                                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.url">
                                    {{ threeItem.label }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.url" :key="subItem.url">
                              <template #title>
                                <i :class="subItem.icon"></i>
                                <span>{{ subItem.label }}</span>
                              </template>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.url" :key="item.url">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.label }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import {computed, reactive, watch} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import menuApi from "../api/menu";
import {ElMessage} from "element-plus";

export default {
    setup() {
        const items = reactive({list:[]});
      const getData = ()=>{
        menuApi.tree().then((res)=>{
          if(res.code === 200){
            items.list = res.data;
          } else {
            ElMessage.error("获取菜单树失败！");
          }
        })
      }
      getData();


        // const items = [
        //     {
        //         icon: "el-icon-lx-home",
        //       url: "/dashboard",
        //       label: "系统首页",
        //     },
        //     {
        //       icon: "el-icon-lx-cascades",
        //       url: "/role",
        //       label: "系统管理",
        //       subs: [
        //         {
        //           icon: "el-icon-lx-cascades",
        //           url: "/user",
        //           label: "用户管理",
        //         },
        //         {
        //           url: "/role",
        //           label: "角色管理",
        //         },
        //         {
        //           url: "/menu",
        //           label: "菜单管理",
        //         },
        //       ]
        //     },
        //     {
        //         icon: "el-icon-lx-copy",
        //         url: "/tabs",
        //         label: "tab选项卡",
        //     },
        //     {
        //         icon: "el-icon-lx-calendar",
        //       url: "3",
        //         label: "表单相关",
        //         subs: [
        //             {
        //               url: "/form",
        //                 label: "基本表单",
        //             },
        //             {
        //               url: "/upload",
        //                 label: "文件上传",
        //             },
        //             {
        //               url: "4",
        //                 label: "三级菜单",
        //                 subs: [
        //                     {
        //                       url: "/editor",
        //                         label: "富文本编辑器",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         icon: "el-icon-lx-emoji",
        //       url: "/icon",
        //         label: "自定义图标",
        //     },
        //     {
        //         icon: "el-icon-pie-chart",
        //       url: "/charts",
        //         label: "schart图表",
        //     },
        //     {
        //         icon: "el-icon-lx-global",
        //       url: "/i18n",
        //         label: "国际化功能",
        //     },
        //     {
        //         icon: "el-icon-lx-warn",
        //       url: "7",
        //         label: "错误处理",
        //         subs: [
        //             {
        //               url: "/permission",
        //                 label: "权限测试",
        //             },
        //             {
        //               url: "/404",
        //                 label: "404页面",
        //             },
        //         ],
        //     },
        //     {
        //         icon: "el-icon-lx-redpacket_fill",
        //       url: "/donate",
        //         label: "支持作者",
        //     },
        // ];

        const route = useRoute();

        const onRoutes = computed(() => {
            return route.path;
        });

        const store = useStore();
        const collapse = computed(() => store.state.collapse);

        return {
            items,
            getData,
            onRoutes,
            collapse,
        };
    },
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 50px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: 100%;
}
.sidebar > ul > li.el-menu-item,.sidebar > ul > li.el-submenu >>> div.el-submenu__title{
  line-height: 40px ;
  height: 40px ;
}
.sidebar > ul > li.el-submenu > ul > li {
  line-height: 35px ;
  height: 35px ;
}

</style>
