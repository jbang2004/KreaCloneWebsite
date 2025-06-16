#!/bin/bash

# 域名配置检查脚本
# 检查 futureai.click 域名的DNS配置和访问状态

DOMAIN="futureai.click"
WWW_DOMAIN="www.futureai.click"

echo "🔍 域名配置检查工具"
echo "=================="
echo "检查域名: $DOMAIN"
echo "检查时间: $(date)"
echo ""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查函数
check_dns_records() {
    echo -e "${BLUE}📋 检查DNS记录${NC}"
    echo "----------------------------------------"
    
    echo "🔍 检查根域名 ($DOMAIN):"
    dig +short $DOMAIN
    
    echo ""
    echo "🔍 检查www子域名 ($WWW_DOMAIN):"
    local www_records=$(dig +short $WWW_DOMAIN)
    if [ -z "$www_records" ]; then
        echo -e "${RED}❌ 未找到DNS记录${NC}"
    else
        echo "$www_records"
    fi
    
    echo ""
    echo "🔍 详细DNS信息:"
    echo "A记录 ($WWW_DOMAIN):"
    dig +noall +answer $WWW_DOMAIN A
    
    echo "CNAME记录 ($WWW_DOMAIN):"
    local cname_result=$(dig +noall +answer $WWW_DOMAIN CNAME)
    if [ -z "$cname_result" ]; then
        echo -e "${YELLOW}⚠️  未找到CNAME记录${NC}"
    else
        echo "$cname_result"
    fi
    
    echo ""
}

check_record_conflicts() {
    echo -e "${BLUE}⚠️  检查记录冲突${NC}"
    echo "----------------------------------------"
    
    local a_records=$(dig +noall +answer $WWW_DOMAIN A | wc -l)
    local cname_records=$(dig +noall +answer $WWW_DOMAIN CNAME | wc -l)
    
    echo "A记录数量: $a_records"
    echo "CNAME记录数量: $cname_records"
    
    if [ $a_records -gt 0 ] && [ $cname_records -gt 0 ]; then
        echo -e "${RED}❌ 检测到DNS记录冲突！${NC}"
        echo -e "${RED}   同一域名不能同时有A记录和CNAME记录${NC}"
        echo -e "${YELLOW}💡 解决方案：${NC}"
        echo "   1. 删除A记录，保留CNAME记录，或"
        echo "   2. 删除CNAME记录，保留A记录"
    elif [ $a_records -gt 0 ]; then
        echo -e "${GREEN}✅ 使用A记录配置${NC}"
    elif [ $cname_records -gt 0 ]; then
        echo -e "${GREEN}✅ 使用CNAME记录配置${NC}"
    else
        echo -e "${RED}❌ 未找到有效的DNS记录${NC}"
    fi
    
    echo ""
}

check_http_access() {
    echo -e "${BLUE}🌐 检查HTTP访问${NC}"
    echo "----------------------------------------"
    
    # 检查HTTP状态
    echo "🔍 检查 https://$WWW_DOMAIN"
    local http_status=$(curl -I -s --connect-timeout 10 https://$WWW_DOMAIN | head -1)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ HTTP响应: $http_status${NC}"
    else
        echo -e "${RED}❌ HTTP访问失败${NC}"
    fi
    
    echo ""
    echo "🔍 检查响应头:"
    curl -I -s --connect-timeout 10 https://$WWW_DOMAIN | head -10
    
    echo ""
}

check_ssl_certificate() {
    echo -e "${BLUE}🔒 检查SSL证书${NC}"
    echo "----------------------------------------"
    
    local ssl_info=$(echo | openssl s_client -connect $WWW_DOMAIN:443 -servername $WWW_DOMAIN 2>/dev/null | grep -E "subject=|issuer=|verify")
    
    if [ $? -eq 0 ] && [ ! -z "$ssl_info" ]; then
        echo -e "${GREEN}✅ SSL证书信息:${NC}"
        echo "$ssl_info"
    else
        echo -e "${RED}❌ SSL证书检查失败${NC}"
    fi
    
    echo ""
}

check_cloudflare_workers() {
    echo -e "${BLUE}☁️  检查Cloudflare Workers状态${NC}"
    echo "----------------------------------------"
    
    # 检查是否通过Cloudflare
    local cf_ray=$(curl -I -s --connect-timeout 10 https://$WWW_DOMAIN | grep -i "cf-ray")
    if [ ! -z "$cf_ray" ]; then
        echo -e "${GREEN}✅ 检测到Cloudflare: $cf_ray${NC}"
    else
        echo -e "${YELLOW}⚠️  未检测到Cloudflare标头${NC}"
    fi
    
    # 检查服务器响应
    local server_header=$(curl -I -s --connect-timeout 10 https://$WWW_DOMAIN | grep -i "server:")
    if [ ! -z "$server_header" ]; then
        echo "🖥️  服务器信息: $server_header"
    fi
    
    echo ""
}

check_china_access() {
    echo -e "${BLUE}🇨🇳 检查中国大陆访问${NC}"
    echo "----------------------------------------"
    
    # 使用公共DNS服务器测试解析
    echo "🔍 使用不同DNS服务器测试解析:"
    
    echo "阿里DNS (223.5.5.5):"
    dig @223.5.5.5 +short $WWW_DOMAIN | head -3
    
    echo "腾讯DNS (119.29.29.29):"
    dig @119.29.29.29 +short $WWW_DOMAIN | head -3
    
    echo "Cloudflare DNS (1.1.1.1):"
    dig @1.1.1.1 +short $WWW_DOMAIN | head -3
    
    echo ""
}

generate_recommendations() {
    echo -e "${BLUE}💡 配置建议${NC}"
    echo "----------------------------------------"
    
    local a_records=$(dig +noall +answer $WWW_DOMAIN A | wc -l)
    local cname_records=$(dig +noall +answer $WWW_DOMAIN CNAME | wc -l)
    
    if [ $a_records -gt 0 ] && [ $cname_records -gt 0 ]; then
        echo -e "${RED}🚨 紧急：解决DNS记录冲突${NC}"
        echo "1. 登录AWS Route53控制台"
        echo "2. 选择托管区域 'futureai.click'"
        echo "3. 删除 www.futureai.click 的A记录 (34.217.153.170)"
        echo "4. 添加CNAME记录指向Cloudflare Workers域名"
        echo ""
    fi
    
    if [ $a_records -eq 0 ] && [ $cname_records -eq 0 ]; then
        echo -e "${YELLOW}⚠️  需要配置DNS记录${NC}"
        echo "选择以下方案之一:"
        echo "方案1: 添加CNAME记录 (推荐)"
        echo "  - 记录名称: www"
        echo "  - 记录类型: CNAME"
        echo "  - 值: your-worker.your-subdomain.workers.dev"
        echo ""
        echo "方案2: 使用A记录"
        echo "  - 记录名称: www"
        echo "  - 记录类型: A"
        echo "  - 值: Cloudflare Workers IP地址"
        echo ""
    fi
    
    echo "📚 详细配置指南请查看: DOMAIN_SETUP_GUIDE.md"
    echo ""
}

# 主执行流程
main() {
    check_dns_records
    check_record_conflicts
    check_http_access
    check_ssl_certificate
    check_cloudflare_workers
    check_china_access
    generate_recommendations
    
    echo -e "${GREEN}🎉 检查完成!${NC}"
    echo "如需帮助，请参考 DOMAIN_SETUP_GUIDE.md 文档"
}

# 检查依赖命令
check_dependencies() {
    local deps=("dig" "curl" "openssl")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            missing_deps+=($dep)
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ 缺少必要工具: ${missing_deps[*]}${NC}"
        echo "请安装缺少的工具后重新运行脚本"
        exit 1
    fi
}

# 脚本入口
check_dependencies
main 