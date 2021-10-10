<template>
    <div>
        <div class="container custom-tree-container" >
          <el-input v-model="filterText" placeholder="请输入过滤的关键字" size="mini" style="width: 600px"/>
          <el-button type="success" icon="el-icon-plus" size="mini" style="margin-left: 10px" @click="openAddDialog(0)">添加根目录</el-button>
          <div class="block">
            <el-tree ref="treeRef"
                :data="dataSource.list"
                node-key="id"
                default-expand-all
                :expand-on-click-node="true"
                :filter-node-method="filterNode"
            >
              <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }} <el-tag :type="data.menuType ===0?'success':'warning'" size="mini">{{data.menuType ===0?'菜单':'权限'}}</el-tag></span>
            <span>
              <el-button icon="el-icon-plus"  type="text" class="green" size="mini" @click="openAddDialog(data)">添加</el-button>
              <el-button icon="el-icon-edit"  type="text" size="mini" @click="openEditDialog(data)">编辑</el-button>
              <el-button icon="el-icon-delete" type="text" class="red" size="mini" @click="handleDelete(data)">删除</el-button>
            </span>
          </span>
              </template>
            </el-tree>
          </div>
        </div>
      <!-- 添加菜单对话框-->
      <el-dialog title="添加菜单" v-model="addVisible" width="30%" >
        <el-form label-width="70px">
          <el-form-item label="菜单名称">
            <el-input v-model="addForm.label"  size="mini"></el-input>
          </el-form-item>
          <el-form-item label="菜单url">
            <el-input v-model="addForm.url" size="mini"></el-input >
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="addForm.perms" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="addForm.icon" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="addForm.available">
              <el-radio  size="mini" :label="0">禁用</el-radio>
              <el-radio  size="mini" :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否展开">
            <el-radio-group v-model="addForm.isOpen">
              <el-radio size="mini" :label="0">折叠</el-radio>
              <el-radio size="mini" :label="1">展开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="序号">
            <el-input-number v-model="addForm.orderNum" :min="1" size="mini"></el-input-number>
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-radio-group v-model="addForm.menuType">
              <el-radio size="mini" :label="0">菜单</el-radio>
              <el-radio  size="mini" :label="1">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false"  size="mini">取 消</el-button>
                    <el-button type="primary" @click="addMenu"  size="mini">确 定</el-button>
                </span>
        </template>
      </el-dialog>
      <!-- 添加菜单对话框-->
      <el-dialog title="编辑菜单" v-model="editVisible" width="30%" >
        <el-form label-width="70px">
          <el-form-item label="菜单名称">
            <el-input v-model="editForm.label"  size="mini"></el-input>
          </el-form-item>
          <el-form-item label="菜单url">
            <el-input v-model="editForm.url" size="mini"></el-input >
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="editForm.perms" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="editForm.icon" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="editForm.available">
              <el-radio  size="mini" :label="0">禁用</el-radio>
              <el-radio  size="mini" :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否展开">
            <el-radio-group v-model="editForm.isOpen">
              <el-radio size="mini" :label="0">折叠</el-radio>
              <el-radio size="mini" :label="1">展开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="序号">
            <el-input-number v-model="editForm.orderNum" :min="1" size="mini"></el-input-number>
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-radio-group v-model="editForm.menuType">
              <el-radio size="mini" :label="0">菜单</el-radio>
              <el-radio  size="mini" :label="1">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false"  size="mini">取 消</el-button>
                    <el-button type="primary" @click="editMenu"  size="mini">确 定</el-button>
                </span>
        </template>
      </el-dialog>
    </div>
</template>

<script>
import {ref, reactive, watch} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import menuApi from "../../api/menu";
export default {
    name: "menu-manage",
    setup() {
      const addVisible = ref(false);
      const editVisible = ref(false);
      const addForm = reactive({
        label:"",
        url:"",
        perms:"",
        icon:"",
        available:1,
        isOpen:1,
        orderNum:1,
        menuType:0,
        parentId:null
      });
      const editForm = reactive({
        id:null,
        label:"",
        url:"",
        perms:"",
        icon:"",
        available:1,
        isOpen:1,
        orderNum:1,
        menuType:0,
        parentId:null
      });
      const filterText = ref("");
      let dataSource = reactive({list:[]});

      let treeRef = ref(null);
      watch(filterText,(val)=>{
        return treeRef.value.filter(val)
      })


      const  filterNode = (value, data) =>{
        if (!value) {
          return true;
        }
        return data.label.indexOf(value) !== -1
      };

      const openAddDialog = (parent) => {
        addForm.parentId = parent.id;
        addVisible.value = true;
      }

      const openEditDialog = (data) => {

        Object.keys(editForm).forEach((item) => {
          editForm[item] = data[item];
        });
        editVisible.value = true;
      }

      const getData = ()=>{
        menuApi.tree().then((res)=>{
          if(res.code === 200){
            dataSource.list = res.data;
          } else {
            ElMessage.error("获取菜单树失败！");
          }
        })
      }
      getData();
      const addMenu = ()=>{
        menuApi.add(addForm).then((res)=>{
          if(res.code === 200){
            addVisible.value = false;
            getData();
            ElMessage.success(res.message);
          } else {
            ElMessage.error("添加菜单失败！");
          }
        })
      };

      const editMenu = ()=>{
        menuApi.update(editForm).then((res)=>{
          if(res.code === 200){
            editVisible.value = false;
            getData();
            ElMessage.success(res.message);
          } else {
            ElMessage.error("更新菜单失败！");
          }
        })
      };

      // 删除操作
      const handleDelete = (data) => {
        // 二次确认删除
        ElMessageBox.confirm("确定要删除吗？", "提示", {
          type: "warning",
        })
            .then(() => {
              menuApi.del(data.id).then((res)=>{
                if(res.code === 200){
                  ElMessage.success("删除成功");
                  getData();
                } else {
                  ElMessage.error("删除失败！");
                }

              })

            })
            .catch(() => {});
      };
      return {
        dataSource,
        filterText,
        filterNode,
        treeRef,
        addVisible,
        addForm,
        editForm,
        openAddDialog,
        addMenu,
        getData,
        editVisible,
        openEditDialog,
        editMenu,
        handleDelete,
      }
    },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-form-item{
  margin-bottom: 0px;
}
.red {
  color: #ff0000;
}
.green{
  color: #74B016FF;
}
</style>
