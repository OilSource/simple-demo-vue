<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.roleName"  size="mini" placeholder="角色名称" class="handle-input mr10"></el-input>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" size="mini" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </div>
            <el-table :cell-style="{padding:'0'}" :header-cell-style="{padding:'2px'}" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                <el-table-column prop="creator" label="创建人"  align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"  width="180"></el-table-column>
                <el-table-column prop="updater" label="创建人" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" width="180"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                      <el-switch
                          v-model="scope.row.roleState"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          :active-value="1"
                          :inactive-value="0" @change="changeState(scope.row)">
                      </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                      <el-button type="text" class="orange" icon="el-icon-user-solid" size="mini" @click="openAuthorityDialog(scope.row)">授权</el-button>
                        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" size="mini"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageNum"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
      <!-- 授权弹出框 -->
      <el-dialog title="角色授权" v-model="authorityVisible" width="30%">
        <div class="block">
          <el-tree ref="authorityRef"
                   :data="authorityData"
                   show-checkbox
                   node-key="id"
                   default-expand-all
                   :expand-on-click-node="true"
                   @check="checkChange"
          >
            <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }} <el-tag :type="data.menuType ===0?'success':'warning'" size="mini">{{data.menuType ===0?'菜单':'权限'}}</el-tag></span>
            </span>
            </template>
          </el-tree>
        </div>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="authorityVisible = false"  size="mini">取 消</el-button>
                    <el-button type="primary" @click="doAuthority"  size="mini">确 定</el-button>
                </span>
        </template>
      </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑角色" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="form.roleName" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" size="mini"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false"  size="mini">取 消</el-button>
                    <el-button type="primary" @click="updateEdit"  size="mini">确 定</el-button>
                </span>
            </template>
        </el-dialog>
      <!-- 添加弹出框 -->
      <el-dialog title="新增角色"  v-model="addVisible" width="30%">
        <el-form label-width="70px">
          <el-form-item label="角色名称">
            <el-input v-model="addForm.roleName" size="mini" ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addForm.remark" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false"  size="mini">取 消</el-button>
                    <el-button type="primary" @click="saveEdit"  size="mini">确 定</el-button>
                </span>
        </template>
      </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import roleApi from "../../api/role";
import menuApi from "../../api/menu";

export default {
    name: "role-manage",
    setup() {
        const query = reactive({
            roleName: "",
            pageNum: 1,
            pageSize: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        const authorityVisible = ref(false);
        const authorityData = ref([]);
        const authorityRef =  ref(null);
        const authorityForm = reactive({
          roleId:null
        })
        // 获取表格数据
        const getData = () => {
          roleApi.pageList(query).then((res) => {
                if(res.code === 200){
                  tableData.value = res.data.rows;
                  pageTotal.value = res.data.total;
                } else {
                  ElMessage.error("获取用户列表失败！")
                }

            });
        };
        getData();

        const getTreeData = (roleId)=>{
          menuApi.roleTree(roleId).then((res)=>{
            if(res.code === 200){
              authorityData.value = res.data.tree;
              authorityForm.roleId = res.data.roleId;
              authorityVisible.value = true;
              setTimeout(()=>{
                let list = res.data.menuIdList;
                for(let i in list){
                  const node = authorityRef.value.getNode(list[i]);
                  node.checked =true;
                  setNode(node);
                }
                console.log(authorityRef.value.getCheckedKeys())
              },100)

            } else {
              ElMessage.error("获取菜单树失败！");
            }

          })
        }


        // 查询操作
        const handleSearch = () => {
            query.pageIndex = 1;
            getData();
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.pageIndex = val;
            getData();
        };

        // 删除操作
        const handleDelete = (index,row) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                  roleApi.del(row.id).then((res)=>{
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
        //表格新增时弹框
        const addVisible = ref(false);
        let addForm = reactive({
          roleName:"",
          remark:"",
        });

        const handleAdd = () => {
          addVisible.value = true;
        };
        // 表格编辑时弹窗
        const editVisible = ref(false);
        let form = reactive({
            id:null,
            roleName: "",
            remark: "",
        });
        let idx = -1;
        const handleEdit = (index, row) => {
            idx = index;
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            editVisible.value = true;
        };
        const saveEdit = () => {
            roleApi.add(addForm).then((res)=>{
              if(res.code === 200){
                getData();
                ElMessage.success(res.message);
              } else {
                ElMessage.error(res.message);
              }
              addVisible.value = false;
            });
        };

        const updateEdit = () => {
            roleApi.update(form).then((res)=>{
            if(res.code === 200){
              getData();
              ElMessage.success(res.message);
            } else {
              ElMessage.error(res.message);
            }
            editVisible.value = false;
          });

        };

        const changeState = (row) =>{
          if(row.id){
            roleApi.updateState({id:row.id,roleState:row.roleState}).then((res)=>{
              if(res.code === 200){
                getData();
                ElMessage.success(res.message);
              } else {
                ElMessage.error(res.message);
              }
            });
          }
        };

        const openAuthorityDialog = (row)=>{
          getTreeData(row.id);
        };

        const doAuthority = () =>{
          roleApi.authority({roleId:authorityForm.roleId,menuIdList:authorityRef.value.getCheckedKeys()}).then((res)=>{
            if(res.code === 200){
              authorityVisible.value = false;
              ElMessage.success("角色授权成功！")
            } else {
              ElMessage.error("角色授权失败！")
            }
          });
        };
        const checkChange = (data) => {
          const node = authorityRef.value.getNode(data.id);
          setNode(node);
        };
        const setNode = (node)=>{
          if(node.checked){
            setParentNode(node);
          } else {
            if(node.parent){
              let checkedNode = node.parent.childNodes.find(item => item.checked);
              if(null!== checkedNode && undefined !== checkedNode){
                node.parent.checked = true;
              }
            }
            setChildrenNode(node);
          }
        }
        const setParentNode = (node) => {
          if(node.parent){
            for(let key in node){
              if(key === 'parent'){
                node[key].checked = true;
                setParentNode(node[key])
              }
            }
          }
        }
        const setChildrenNode = (node) =>{
          let len = node.childNodes.length;
          for(let i =0;i<len;i++){
            node.childNodes[i].checked = false;
            setChildrenNode(node.childNodes[i])
          }
        }
        return {
            query,
            tableData,
            pageTotal,
            addVisible,
            addForm,
            editVisible,
            form,
            authorityVisible,
            authorityData,
            authorityForm,
            authorityRef,
            handleSearch,
            handlePageChange,
            handleDelete,
            handleEdit,
            handleAdd,
            saveEdit,
            updateEdit,
            changeState,
            getTreeData,
            openAuthorityDialog,
            doAuthority,
            checkChange,
            setNode,
            setParentNode,
            setChildrenNode,
        };
    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 10px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.orange{
  color: orange;
}
.mr10 {
    margin-right: 10px;
}
.el-form-item{
  margin-bottom: 0px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
