<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.username"  size="mini" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" size="mini" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </div>
            <el-table :cell-style="{padding:'0'}" :header-cell-style="{padding:'2px'}" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
              <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                <el-table-column prop="creator" label="创建人"  align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"  width="180"></el-table-column>
                <el-table-column prop="updater" label="创建人" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" width="180"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column label="状态" align="center" width="70">
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.userState"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0" @change="changeState(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="35%" >
            <el-form label-width="90px"  :rules="rules" ref="editUserForm" :model="form" class="user__form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" disabled  size="mini"></el-input>
                </el-form-item>
              <el-form-item label="角色" prop="roleId">
                <el-select filterable v-model="form.roleId"  placeholder="请选择"  size="mini" style="width: 100%">
                  <el-option v-for="item in roleList" :value="item.id" :key="item.roleName" :label="item.roleName"/>
                </el-select>
              </el-form-item>
              <el-form-item label="密码"  prop="pwd">
                <el-input type="password" v-model="form.pwd" size="mini"></el-input >
              </el-form-item>
              <el-form-item label="确认密码"  prop="confirmPwd">
                <el-input type="password"  v-model="form.confirmPwd" size="mini"></el-input>
              </el-form-item>
                <el-form-item label="备注" prop="remark">
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
      <el-dialog title="新增用户"  v-model="addVisible" width="35%" >
        <el-form label-width="90px" :rules="rules" ref="addUserForm" :model="addForm" class="user__form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" size="mini" ></el-input>
          </el-form-item>
          <el-form-item label="角色"  prop="roleId">
            <el-select filterable v-model="addForm.roleId"  placeholder="请选择"  size="mini" style="width: 100%">
              <el-option v-for="item in roleList" :value="item.id" :key="item.roleName" :label="item.roleName"/>
            </el-select>
          </el-form-item>
          <el-form-item label="密码"  prop="pwd">
            <el-input type="password"  v-model="addForm.pwd" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="确认密码"  prop="confirmPwd">
            <el-input type="password" v-model="addForm.confirmPwd" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="备注"  prop="remark">
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
import userApi from "../../api/user";
import roleApi from "../../api/role";

export default {
    name: "user-manage",
    setup() {
        const query = reactive({
            username: "",
            pageNum: 1,
            pageSize: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        //表格新增时弹框
        const addVisible = ref(false);
        const addForm = reactive({
          username:"",
          pwd:"",
          confirmPwd:"",
          remark:"",
          roleId:null,
        });

        // 表格编辑时弹窗
        const editVisible = ref(false);
        const form = reactive({
          id:null,
          username: "",
          remark: "",
          pwd:"",
          confirmPwd:"",
          roleId:null
        });
        //角色列表
        const roleList = ref([]);
        const addUserForm = ref(null);
        const editUserForm = ref(null);
        const rules = {
          username: [
            {
              required: true,
              message: "请输入用户名",
              trigger: "blur",
            },
          ],
          pwd: [
            { required: true, message: "请输入密码", trigger: "blur" },
          ],
          confirmPwd: [
            { required: true, message: "请输入确认密码", trigger: "blur" },
          ],
          roleId: [
            { required: true, message: "请选择", trigger: "blur" },
          ],
        };
        // 获取表格数据
        const getData = () => {
          userApi.pageList(query).then((res) => {
                if(res.code === 200){
                  tableData.value = res.data.rows;
                  pageTotal.value = res.data.total;
                } else {
                  ElMessage.error("获取用户列表失败！")
                }

            });
        };

        //获取角色数据
        const getRoleList = ()=>{
          roleApi.list().then((res)=>{
            if(res.code === 200){
              roleList.value = res.data;
            } else {
              ElMessage.error("获取角色列表失败！")
            }
          })
        }
        getRoleList();
        getData();

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
                  userApi.del(row.id).then((res)=>{
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


        const handleAdd = () => {
          addVisible.value = true;
        };

        let idx = -1;
        const handleEdit = (index, row) => {
            idx = index;
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            editVisible.value = true;
        };
        const saveEdit = () => {
          addUserForm.value.validate((valid) => {
            if(valid){
              userApi.add(addForm).then((res)=>{
                if(res.code === 200){
                  getData();
                  ElMessage.success(res.message);
                } else {
                  ElMessage.error(res.message);
                }
                addVisible.value = false;
              }).catch((e)=>{
                console.error(e);
                ElMessage.error("添加用户异常");
              });
            }
          })
        };

        const updateEdit = () => {
          userApi.update(form).then((res)=>{
            if(res.code === 200){
              getData();
              ElMessage.success(res.message);
            } else {
              ElMessage.error(res.message);
            }
            editVisible.value = false;
          }).catch((e) =>{
            ElMessage.error("用户更新失败！");
          });

        };

        const changeState = (row) =>{
          if(row.id){
            userApi.updateState({id:row.id,userState:row.userState}).then((res)=>{
              if(res.code === 200){
                getData();
                ElMessage.success(res.message);
              } else {
                ElMessage.error(res.message);
              }
            });
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
            roleList,
            rules,
            addUserForm,
            editUserForm,
            handleSearch,
            handlePageChange,
            handleDelete,
            handleEdit,
            handleAdd,
            saveEdit,
            updateEdit,
            changeState,
            getRoleList
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
.mr10 {
    margin-right: 10px;
}
.el-form-item{
  margin-bottom: 3px;
}
.user__form /deep/ .el-form-item__error {
  top: 80%!important;
}
</style>
