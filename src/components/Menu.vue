<template>
  <div>
    <template v-for="list in this.menuList">
      <el-submenu v-if="listIsEmpty(list.children)" :key="list.menuId" :index="list.menuId + ''">
        <template slot="title" style="padding-left:10px">
          <i v-if="!isNull(list.img)" :class="list.img"></i>
          <span slot="title">{{ list.name }}</span>
        </template>
        <Menu :menuList="list.children"></Menu>
      </el-submenu>
      <el-menu-item
        v-else
        :index="list.url"
        :key="list.menuId"
        :class="itemStyle"
      >
        <i v-if="!isNull(list.img)" :class="list.img"></i>
        <span>{{list.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
export default {
  name: "Menu", //模板名称
  data() {
    return {};
  },
  methods: {
    listIsEmpty(children) {
      if (
        typeof children == "undefined" ||
        children == null ||
        children.length == 0
      ) {
        return false;
      }
      return true;
    },
    isNull(url) {
      if (typeof url == "undefined" || url == null || url == "") {
        return true;
      } else {
        return false;
      }
    },
    itemStyle(){
      return isNull(list.img)? otherMenu: firstMenu
    }
  },
  mounted() {},
  props: ["menuList"]
};
</script>
<style lang="scss">
.el-menu--collapse span,
.el-menu--collapse i.el-submenu__icon-arrow {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}

.firstMenu {
  padding-left: 20px;
  padding-right: 20px;
}

.otherMenu {
  padding-left: 50px;
  padding-right: 0px;
}
</style>
